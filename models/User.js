const mongoose = require("mongoose");

let Schema = mongoose.Schema;

let UserSchema = new Schema({
    username: {
        type: String,
        required: true,
    },

    password: {
        type: String,
        required: true,
    },

    // email: {
    //     type: String,
    //     required: true,
    // },

    imageURL: {
        type: String,
        require: true,
    },

    likedcomics: [{}],
});

let User = mongoose.model("User", UserSchema);

module.exports = User;