// Code from a tutorial made by Filip Jerga: https://www.youtube.com/watch?v=ASuU4km3VHE
// Git repo containing code: https://github.com/Jerga99/book-with-me-ng/blob/master/server/routes/file-upload.js

const express = require("express");
const router = express.Router();

const upload = require('../services/image-upload');
const singleUpload = upload.single('image');

const Image = require("../models/image")

router.post('/image-upload', function(req, res) {

  singleUpload(req, res, function(err) {

    if (err) {
      return res.status(422).send({errors: [{title: 'File Upload Error', detail: err.message}] });
    }

    return res.json({'imageUrl': req.file.location});
  });
});

router.post('/save-url', function(req, res) {
  let newImage = new Image();
  newImage.username = req.body.username;
  newImage.imageUrl = req.body.imageUrl;

  newImage.save((err, Image) => {
    if (err) {
      return res.status(400).send({
        message: newImage.username,
        success: false
      });
    } else {
      return res.status(201).send({
        message: "Image added",
        success: true
      });
    }
  });
});

router.get("/get-all-images", (req, res) => {

  Image.find({}, function(err, images) {
    if(images === null) {
      return res.status(201).send({
        message: "There are no images",
        success: false
      });
    } else {
      return res.json(images);  
    }
  });
});

router.post("/delete-image", (req, res) => {
  Image.deleteOne({imageUrl: req.body.imageUrl}, function(err) {
    if (err) {
      return res.status(422).send({errors: [{title: 'Failed to Delete', detail: err.message}] });
    } else {
      return res.status(201).send({
        message: "Image Deleted",
        success: true
      });
    }
  });
});

router.post("/update-image", (req,res) => {
  Image.updateOne({imageUrl: req.body.oldImageUrl}, {$set: {imageUrl: req.body.newImageUrl}}, function(err) {
    if (err) {
      return res.status(422).send({errors: [{title: 'Failed to Update Image', detail: err.message}] });
    } else {
      return res.status(201).send({
        message: "Image added",
        success: true
      });
    }
  });
});

module.exports = router;