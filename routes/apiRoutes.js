//insert stuff for api / database reactions here

const axios = require('axios');
let db = require("../models");
let KEY = "e6b281f12cc2dd75410200faab564f4919d8a557";

module.exports = function (app) {
    app.get('/api/hero/:id/:pub/:batchnum', async function (req, res) {
        // console.log("no api call yet");
        let id = req.params.id;
        let batchnum = parseInt(req.params.batchnum);
        let publisher = req.params.pub;
        let returnData = {
            volumepackets: [],
            batchnum: batchnum + 10,
        };
        console.log("\n\nRunning BATCH: " + ((batchnum / 10) + 1) + "\n");
        let query = "http://comicvine.gamespot.com/api/issues/?api_key=" + KEY + "&format=json&&sort=cover_date:desc&filter=name:" + id + "&limit=10&offset=" + req.params.batchnum;
        // console.log(query);
        axios.get(query).then(function (iData) {
            let validatedVolumes = [];
            let volumeIds = [];

            // console.log("inside first call\n\n");
            console.log("  Running first validation phase")
            for (let i = 0; i < iData.data.results.length; i++) {
                let result = iData.data.results[i];
                if (result.cover_date === null || result.cover_date === "") {
                    console.log("    Result " + (i + 1) + ": " + result.cover_date + " - " + result.volume.id + " - " + result.volume.api_detail_url + " - FAILED --> REASON: no cover date found");
                    // console.log("no cover date\n\n")
                }
                else {
                    if (parseInt(result.cover_date.substring(0, 4)) < 2005) {
                        console.log("    Result " + (i + 1) + ": " + result.cover_date + " - " + result.volume.id + " - " + result.volume.api_detail_url + " - FAILED --> REASON: cover date is too old");
                        // console.log(result.cover_date);
                        // console.log("cover date is too old\n\n")
                    }
                    else {
                        // console.log(result.volume);
                        if (result.volume.id === null || result.volume.id === "") {
                            console.log("    Result " + (i + 1) + ": " + result.cover_date + " - " + result.volume.id + " - " + result.volume.api_detail_url + " - FAILED --> REASON: no volume id found");
                            // console.log("no volume id\n\n")
                        }
                        else {
                            if (volumeIds.length === 0) {
                                volumeIds.push(result.volume.id);
                                validatedVolumes.push(result.volume.api_detail_url);
                                console.log("    Result " + (i + 1) + ": " + result.cover_date + " - " + result.volume.id + " - " + result.volume.api_detail_url + " - PASSED");
                            }
                            else {
                                if (volumeIds.indexOf(result.volume.id) === -1) {
                                    volumeIds.push(result.volume.id);
                                    validatedVolumes.push(result.volume.api_detail_url);
                                    console.log("    Result " + (i + 1) + ": " + result.cover_date + " - " + result.volume.id + " - " + result.volume.api_detail_url + " - PASSED");
                                }
                                else {
                                    console.log("    Result " + (i + 1) + ": " + result.cover_date + " - " + result.volume.id + " - " + result.volume.api_detail_url + " - FAILED --> REASON: volume already validated for this batch");
                                    // console.log("volume already included");
                                }
                            }
                        }
                    }
                }
            }

            console.log("  " + validatedVolumes.length + " out of " + iData.data.results.length + " results passed first validation phase!");

            getVolumesAndIssues(validatedVolumes, publisher).then(function (data) {
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

async function getVolumesAndIssues(validatedVolumes, publisher) {
    let returnData = [];

    console.log("\n  Running second validation stage");
    for (let i = 0; i < validatedVolumes.length; i++) {
        let vData = await axios.get(validatedVolumes[i] + "?api_key=" + KEY + "&format=json")
        // console.log(vData.data.results);
        if (vData.data.results.publisher.name === publisher) {
            let fData = await axios.get(vData.data.results.first_issue.api_detail_url + "?api_key=" + KEY + "&format=json")

            let lData = await axios.get(vData.data.results.last_issue.api_detail_url + "?api_key=" + KEY + "&format=json")

            let packet = {
                volumedata: vData.data.results,
                firstdata: fData.data.results,
                lastdata: lData.data.results,
            }
            console.log("--> Result " + (i + 1) + ": Title [" + vData.data.results.name + "] - PASSED");

            returnData.push(packet);
        }
        else {
            console.log("    Result " + (i + 1) + ": Title [" + vData.data.results.name + "] - FAILED --> REASON: invalid publisher name => " + vData.data.results.publisher.name);
        }
    }

    console.log("  " + returnData.length + " out of " + validatedVolumes.length + " results passed seconds validation stage!")
    return returnData;
}