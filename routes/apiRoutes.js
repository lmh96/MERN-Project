//insert stuff for api / database reactions here

const axios = require('axios');
let db = require("../models");
let KEY = "";

module.exports = function (app) {
    app.get('/api/hero/:id', function (req, res) {
        let id = req.params.id;
        let returnData = {
            validationNumber: null,
            volumedata: null,
            firstdata: null,
            lastdata: null,
        };
        // axios.get("http://comicvine.gamespot.com/api/volume/?api_key=" + KEY + "&?format=json&character_credits=" + id).then(function(data) {
        axios.get("http://comicvine.gamespot.com/api/issues/?api_key=" + KEY + "&format=json&&sort=cover_date:desc&filter=name:" + id).then(function (data) {
            // console.log(data);
            let randoOne = Math.floor(Math.random() * data.data.results.length);
            returnData.validationNumber = randoOne;
            //let results = data.data.results;
            let result = data.data.results[randoOne];

            let validComic = false;
            while (!validComic) {   //this is the validation loop to make sure what we're getting from the api had all the information we need to get good results
                if (result.cover_date === null || result.cover_date === "") {
                    let tempRando = Math.floor(Math.random() * data.data.results.length);
                    returnData.validationNumber = tempRando;
                    result = data.data.results[tempRando];
                }
                else {
                    if (result.volume.id === null || result.volume.id === "") {
                        let tempRando = Math.floor(Math.random() * data.data.results.length);
                        returnData.validationNumber = tempRando;
                        result = data.data.results[tempRando];
                    }
                    else {
                        validComic = true;
                    }
                }
            }

            axios.get(result.volume.api_detail_url + "?api_key=" + KEY + "&format=json").then(function (vData) {
                returnData.volumedata = vData.data.results;

                axios.get(vData.data.results.first_issue.api_detail_url + "?api_key=" + KEY + "&format=json").then(function (fData) {
                    returnData.firstdata = fData.data.results;

                    axios.get(vData.data.results.last_issue.api_detail_url + "?api_key=" + KEY + "&format=json").then(function (lData) {
                        returnData.lastdata = lData.data.results;

                        res.json(returnData);
                    });
                });
            });
        });
    });

    app.get("/api/person/:name", function (req, res) {

    });



    app.post("/api/signup", function (req, res) {
        let newUser = req.body;

        newUser.imageURL = "https://www.loginradius.com/wp-content/plugins/all-in-one-seo-pack/images/default-user-image.png";

        db.User.create(newUser).then(function (user) {
            res.json({
                _id: user._id,
                comics: user.likedcomics,
                tokentime: Date.now(),
            });
        });
    });

    app.get("/api/signin/:user/:pass", function (req, res) {
        db.User.findOne({ username: req.params.user, password: req.params.pass }).then(function (user) {
            res.send(user._id);
        }).catch(function (err) {
            console.log(err);
            res.send("invalid username or password");
        });
    });

    app.get("/api/token/:id/:tokentime", function (req, res) {
        db.User.findOne({ _id: req.params.id }).then(function (user) {
            if (Date.now() - req.params.tokentime >= (60 * 60 * 1000)) {
                res.send("your token has expired");
            }
            else {
                res.json({
                    _id: user._id,
                    comics: user.likedcomics,
                    tokentime: Date.now(),
                });
            }
        }).catch(function (err) {
            console.log(err)
            res.send("error");
        });
    });

    app.post("/api/like/:id", function (req, res) {
        let likedcomic = req.body;

        db.User.find({ _id: req.params.id }).then(function (user) {
            let comics = user.likedcomics;
            if (comics.length === null || comics.length === 0) {
                comics.push(likedcomic);
                db.User.update({ _id: req.params.id }, { likedcomics: comics }).then(function (updatedUser) {
                    res.json(updatedUser.likedcomics);
                });
            } else {
                let alreadyLiked = false;
                for (let i = 0; i < comics.length; i++) {
                    if (comics[i].title === likedcomic.title) {
                        alreadyLiked = true;
                        break;
                    }
                }

                if (alreadyLiked) {
                    res.json(comics);
                }
                else {
                    db.User.update({ _id: req.params.id }, { likedcomics: comics }).then(function (updatedUser) {
                        res.json({ comics: updatedUser.likedcomics });
                    });
                }
            }
        });
    });
}