// Code made with a tutorial made by Filip Jerga: https://www.youtube.com/watch?v=ASuU4km3VHE
// Git repo containing code: https://github.com/Jerga99/book-with-me-ng/blob/master/server/routes/file-upload.js

const express = require("express");
const router = express.Router();

const imageMethods = require('../services/image-upload');
const singleUpload = imageMethods.upload.single('image');

const Image = require("../models/image");
const User = require("../models/user");

// image upload end point
router.post('/image-upload', function(req, res) {
  singleUpload(req, res, function(err) {
    if (err) {
      return res.status(422).send({errors: [{title: 'File Upload Error', detail: err.message}] });
    }

    return res.json({'imageUrl': req.file.location});
  });
});

// Save Image Url endpoint
// Images are saved in mongo with the image Url and user's username
router.post('/save-url', function(req, res) {
  let newImage = new Image();
  newImage.username = req.body.username;
  newImage.imageUrl = req.body.imageUrl;

  newImage.save((err, Image) => {
    if (err) {
      return res.status(400).send({
        message: "Failed to save image",
        success: false
      });
    } else {
      // If successfull the user's postNum in incremented by 1
      User.updateOne({username: req.body.username}, {$inc: {numPosts: 1}}, function(err) {
        if(err) {
          return res.status(422).send({
            errors: [{
              title: 'Uploaded image but failed to increment numPost', 
              detail: err.message
            }] 
          });
        } else {
          return res.status(201).send({
            message: "Image added",
            success: true
          });
        }
      });
    }
  });
});

// Get all images end point
// Find and return all images in mongodb in JSON format
router.get("/get-all-images", (req, res) => {
  Image.find({}, {_id: 0}, function(err, images) {        
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

// Delete image endpoint 
router.post("/delete-image", (req, res) => {
  var imageUrl = req.body.imageUrl

  // Retrieve the key at the end of the imageUrl and delete image from S3
  // Url spliting trick by Dblock247 from: https://stackoverflow.com/a/40725409
  var imageKey = imageUrl.split("/").pop();
  imageMethods.deleteImage(imageKey, function(err) {
    if(err) {
      return res.status(422).send({
        errors: [{
          title: 'Failed to Delete From S3', 
          detail: err.message
        }] 
      });
    } else {
      // Search and delete image in mongodb
      Image.deleteOne({imageUrl: imageUrl}, function(err) {
        if (err) {
          return res.status(422).send({
            errors: [{
              title: 'Failed to Delete From Database', 
              detail: err.message
            }] 
          });
        } else {
          // If successful the user's numPosts is decremented by 1
          User.updateOne({username: req.body.username}, {$inc: {numPosts: -1}}, function(err) {
            if(err) {
              return res.status(422).send({
                errors: [{
                  title: 'Failed to decrement numPost', 
                  detail: err.message
                }] 
              });
            } else {
              return res.status(201).send({
                message: "Image Deleted",
                success: true
              });
            }
          });
        }
      });
    }
  });
});

// update image endpoint 
// Search and replace image url in mongodb
router.post("/update-image", (req,res) => {
  Image.updateOne({imageUrl: req.body.oldImageUrl}, {$set: {imageUrl: req.body.newImageUrl}}, function(err) {
    if (err) {
      return res.status(422).send({
        errors: [{
          title: 'Failed to Update Image',
          detail: err.message
        }] 
      });
    } else {
      return res.status(201).send({
        message: "Image added",
        success: true
      });
    }
  });
});

// Replace with placeholder endpoint
// Search and replace image url with placeholder image url
router.post("/replace-with-placeholder", (req,res) => {
  var placeHolderUrl = "https://aip-project2019.s3.ap-southeast-2.amazonaws.com/1570419663723"

  Image.updateOne({imageUrl: req.body.oldImageUrl}, {$set: {imageUrl: placeHolderUrl}}, function(err) {
    if (err) {
      return res.status(422).send({
        errors: [{
          title: 'Failed to Replace Image', 
          detail: err.message
        }] 
      });
    } else {
      return res.status(201).send({
        message: "Image added",
        success: true
      });
    }
  });
})

// Code made by Sanjay Achar from stackoverflow: https://stackoverflow.com/a/47103227
// Save response image url endpoint
// Search for parent image and push the response image data to the parent's children array
router.post("/save-response-image-url", (req, res) => {
  Image.findOne({imageUrl: req.body.parentImageUrl}, function(err, document) {
    if(document) {
      document.children.push({
        username: req.body.username,
        imageUrl: req.body.imageUrl,
      });

      document.save(function(err) {
        if (err) {
          return res.status(422).send({
            errors: [{
              title: 'Failed add response image', 
              detail: err.message
            }] 
          });
        } else {
          return res.status(201).send({
            message: "Image added",
            success: true
          });
        }
      });
    }
  });
});


module.exports = router;