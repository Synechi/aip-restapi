// Code from a tutorial made by Filip Jerga: https://www.youtube.com/watch?v=ASuU4km3VHE
// Git repo containing code: https://github.com/Jerga99/book-with-me-ng/blob/master/server/services/file-upload.js

var aws = require('aws-sdk');
var multer = require('multer');
var multerS3 = require('multer-s3');
 
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
    acl: 'public-read',
    metadata: function (req, file, cb) {
      cb(null, {fieldName: 'TESTING_META_DATA!'});
    },
    key: function (req, file, cb) {
      cb(null, Date.now().toString())
    }
  })
})

module.exports = upload;