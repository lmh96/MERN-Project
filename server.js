const express = require("express");
const parser = require("body-parser");
const path = require("path");

const http = require("http");

const app = express();
const PORT = process.env.PORT || 8080;

let db = require("./models");

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(parser.urlencoded({ extended: true }));
app.use(parser.json());

app.use(express.static(path.join(__dirname, 'build')));

require("./routes/htmlRoutes")(app);
require("./routes/apiRoutes")(app);

// setInterval(function() {
//     http.get("");
// }, 300000);

app.listen(PORT, function () {
    console.log(
        "Listening on port %s",
        PORT
    );
});

module.exports = app;