//insert stuff for api / database reactions here

const axios = require('axios');

module.exports = function (app) {
    app.get('/api/hero/:id', function (req, res) {
        let KEY = "";
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

                    axios.get(vData.data.results.last_issue.api_detail_url + "?api_key=" + KEY + "&format=json").then(function(lData) {
                        returnData.lastdata = lData.data.results;

                        res.json(returnData);
                    })
                })
            })
        })
    })
}