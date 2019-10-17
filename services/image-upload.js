// Code made with a tutorial by Filip Jerga: https://www.youtube.com/watch?v=ASuU4km3VHE
// Git repo containing code: https://github.com/Jerga99/book-with-me-ng/blob/master/server/services/file-upload.js

var aws = require('aws-sdk');
var multer = require('multer');
var multerS3 = require('multer-s3');
 
// Keys for amazon S3 set kere
aws.config.update({
    secretAccessKey: 'Qc7udhJTDnK87Sl5KROPwBQgKfMwHULaGqnxumVL',
    accessKeyId: 'AKIAIWMXUT3OEDRA7UXA',
    region: 'ap-southeast-2'
});

const s3 = new aws.S3();

const upload = multer({
  storage: multerS3({
    s3,
    bucket: 'aip-project2019',
    acl: 'public-read',           // Allow image URL to be publicly accessed
    metadata: function (req, file, cb) {
      cb(null, {fieldName: 'TESTING_META_DATA!'});
    },
    key: function (req, file, cb) {
      cb(null, Date.now().toString())         // Set file key to be the current date and time
    }
  })
});

// Code by Alexander Paterson from: https://alexanderpaterson.com/posts/deleting-objects-from-amazon-s3-with-node
deleteImage = function(filename, callback) {
  var params = {
    Bucket: 'aip-project2019',
    Key: filename
  };
  s3.deleteObject(params, function(err, data) {         // Delete image from S3 using parameters
    if(err) {
      callback(err)
    } else {
      callback(null);
    }
  })
}

module.exports = {
  upload, 
  deleteImage
};