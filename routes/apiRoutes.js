//insert stuff for api / database reactions here

const axios = require('axios');
let db = require("../models");
let KEY = "";

module.exports = function (app) {
    app.get('/api/hero/:id/:batchnum', async function (req, res) {
        // console.log("no api call yet");
        let id = req.params.id;
        let batchnum = parseInt(req.params.batchnum);
        let returnData = {
            volumepackets: [],
            batchnum: batchnum + 10,
        };
        console.log("Running BATCH: " + ((batchnum / 10) + 1));
        let query = "http://comicvine.gamespot.com/api/issues/?api_key=" + KEY + "&format=json&&sort=cover_date:desc&filter=name:" + id + "&limit=10&offset=" + req.params.batchnum;
        // console.log(query);
        axios.get(query).then(function (iData) {
            let validatedVolumes = [];
            let volumeIds = [];

            // console.log("inside first call\n\n");

            for (i = 0; i < iData.data.results.length; i++) {
                let result = iData.data.results[i];
                if (result.cover_date === null || result.cover_date === "") {
                    // console.log("no cover date\n\n")
                }
                else {
                    if (parseInt(result.cover_date.substring(0, 4)) < 2005) {
                        // console.log(result.cover_date);
                        // console.log("cover date is too old\n\n")
                    }
                    else {
                        // console.log(result.volume);
                        if (result.volume.id === null || result.volume.id === "") {
                            // console.log("no volume id\n\n")
                        }
                        else {
                            if (volumeIds.length === 0) {
                                volumeIds.push(result.volume.id);
                                validatedVolumes.push(result.volume.api_detail_url);
                            }
                            else {
                                if (volumeIds.indexOf(result.volume.id) === -1) {
                                    volumeIds.push(result.volume.id);
                                    validatedVolumes.push(result.volume.api_detail_url);
                                }
                                else {
                                    // console.log("volume already included");
                                }
                            }
                        }
                    }
                }
            }

            console.log(validatedVolumes.length + " results passed first validation phase");

            getVolumesAndIssues(validatedVolumes).then(function (data) {
                returnData.volumepackets = data;
                // console.log(returnData);

                res.json(returnData);
            });
        })
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

async function getVolumesAndIssues(validatedVolumes) {
    let returnData = [];

    for (i = 0; i < validatedVolumes.length; i++) {
        let vData = await axios.get(validatedVolumes[i] + "?api_key=" + KEY + "&format=json")
        // console.log(vData.data.results);
        if (vData.data.results.publisher.name === "Marvel" ||
            vData.data.results.publisher.name === "DC Comics") {
            fData = await axios.get(vData.data.results.first_issue.api_detail_url + "?api_key=" + KEY + "&format=json")

            lData = await axios.get(vData.data.results.last_issue.api_detail_url + "?api_key=" + KEY + "&format=json")

            let packet = {
                volumedata: vData.data.results,
                firstdata: fData.data.results,
                lastdata: lData.data.results,
            }
            console.log("result " + (i + 1) + " passed second validation phase");

            returnData.push(packet);
        }
        else {
            console.log("result " + (i + 1) + " did not pass second validaiton phase REASON: invalid publisher name => " + vData.data.results.publisher.name);
        }
    }

    return returnData;
}