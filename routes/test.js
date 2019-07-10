
const axios = require('axios');
let db = require("../models");
let KEY = "e6b281f12cc2dd75410200faab564f4919d8a557";

module.exports = function (app) {
    function searchByHero(req, res) {
        let id = req.params.id;
        let returnData = {
            volumepackets: [],
        };
        axios.get("http:comicvine.gamespot.com/api/issues/?api_key" + KEY + "&format=json&sort=cover_date:desc&filter=name:" + id).then(function (iData) {
            let validatedVolumes = [];
            let volumeIds = [];

            for (i = 0; i < iData.data.result.length; i++) {
                let result = iData.data.result[i];
                if (result.cover_date === null || result.cover_date === "") {

                }
                else {
                    if (parseInt(result.cover_date.substring(0, 4)) < 2005) {

                    }
                    else {
                        if (result.volume.id === null || result.volume.id) {

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
                            }
                        }
                    }
                }
            }

            for (i = 0; i < validatedVolumes.length; i++) {
                axios.get(validatedVolumes[i] + "?api_key=" + KEY + "&format=json").then(function (vData) {
                    let packet = {
                        volumedata: vData.data.results,
                        firstdata: null,
                        lastdata: null,
                    }

                    axios.get(vData.data.results.first_issue.api_detail_url + "?api_key=" + KEY + "&format=json").then(function (fData) {
                        packet.firstdata = fData.data.results;

                        axios.get(vData.data.results.last_issue.api_detail_url + "?api_key=" + KEY + "&format=json").then(function (lData) {
                            packet.lastdata = lData.data.results;

                            returnData.volumepackets.push(packet);
                        })
                    })
                })
            }

            res.json(returnData);
        })
    }
};








async function searchByHero(req, res) {
    let id = req.params.id;
    let returnData = {
        validationNumber: null,
        volumedata: null,
        firstdata: null,
        lastdata: null,
    };
    axios.get("http://comicvine.gamespot.com/api/issues/?api_key=" + KEY + "&format=json&&sort=cover_date:desc&filter=name:" + id).then(function (data) {
        //  console.log(data.data.results);
        let randoOne = Math.floor(Math.random() * data.data.results.length);
        returnData.validationNumber = randoOne;

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
            // console.log(vData.data.results);

            axios.get(vData.data.results.first_issue.api_detail_url + "?api_key=" + KEY + "&format=json").then(function (fData) {
                returnData.firstdata = fData.data.results;

                axios.get(vData.data.results.last_issue.api_detail_url + "?api_key=" + KEY + "&format=json").then(function (lData) {
                    returnData.lastdata = lData.data.results;

                    res.json()
                });
            });
        });
    });
}