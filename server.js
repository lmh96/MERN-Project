const express = require("express");
const parser = require("body-parser");
const path = require("path");

const mongoose = require("mongoose");

const http = require("http");

const app = express();
const PORT = process.env.PORT || 8080;

//let db = require("./models");

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(parser.urlencoded({ extended: true }));
app.use(parser.json());

app.use(express.static(path.join(__dirname, 'build')));

// require("./routes/htmlRoutes")(app);
require("./routes/apiRoutes")(app);

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname+'/build/index.html'));
});
// setInterval(function() {
//     http.get("");
// }, 300000);
let user = "heroku_2psjs7x5";
let pass = "doesthiswork1";
// mongoose.connect("mongodb://" + user + ":" + pass + "@ds347367.mlab.com:47367/heroku_2psjs7x5", {useNewUrlParser: true});

app.listen(PORT, function () {
    console.log(
        "Listening on port %s",
        PORT
    );
});

module.exports = app;