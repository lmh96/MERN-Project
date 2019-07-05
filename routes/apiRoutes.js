//insert stuff for api / database reactions here

const axios = require('axios');

module.exports = function (app) {
    app.get('/api/hero/:id', function (req, res) {
        let KEY = "";
        let id = req.params.id;
        // axios.get("http://comicvine.gamespot.com/api/volume/?api_key=" + KEY + "&?format=json&character_credits=" + id).then(function(data) {
        axios.get("http://comicvine.gamespot.com/api/issues/?api_key=" + KEY + "&format=json&&sort=cover_date:desc&filter=name:" + id).then(function (data) {
            // console.log(data);
            let results = data.data.results;
            for (let i = 0; i < results.length; i++) {
                if (results[i].description !== null)
                    if (results[i].cover_date === null) {

                    } else {
                        if(parseInt(results[i].cover_date.substring(0,4)) > 2005) {
                            if(results[i].volume.id === null) {

                            } else {
                                // console.log(results[i].name);
                                // console.log(results[i].volume);
                                // console.log("\n");
                                axios.get(results[i].volume.api_detail_url + "?api_key=" + KEY + "&format=json").then(function(vData) {
                                    console.log(vData.data);
                                })
                            }
                        }
                        // axios.get("http://comicvine.com/api/volumes/?api_key=" + KEY + "&format=json&filter=id:" + results[i].volume.id).then(function(vData) {
                        //     console.log(vData.data);
                        // })
                        // console.log(results[i]);
                    }
            }
            // console.log(results);
            // res.json(data);
        })
    })
}