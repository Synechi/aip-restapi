const mongoose = require("mongoose");

var ImageSchema = new mongoose.Schema({
    username: {
      type: String,
      required: true
    },
    imageUrl: {
      type: String,
      required: true
    },
});

const User = (module.exports = mongoose.model("Image", ImageSchema));