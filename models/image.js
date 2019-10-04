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

const Image = (module.exports = mongoose.model("Image", ImageSchema));