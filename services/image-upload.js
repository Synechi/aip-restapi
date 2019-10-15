// code made with multer-imamger usage example: https://www.npmjs.com/package/multer-imager

var multer = require('multer');
var imager = require('multer-imager');

// Images are upload to amazon S3 through multer-imager
const upload = multer({
  storage: imager({
    dirname: 'image',
    bucket: 'aip-project2019',
    secretAccessKey: 'Qc7udhJTDnK87Sl5KROPwBQgKfMwHULaGqnxumVL',
    accessKeyId: 'AKIAIWMXUT3OEDRA7UXA',
    region: 'ap-southeast-2',

    // Define graphicsmagick options
    gm: {                                 
      // Define the maximum dimensions of the image
      // Images are expanded or contracted to fit these values whilist keeping aspect ratio
      // More info in graphicsmagick doc: inhttp://www.graphicsmagick.org/GraphicsMagick.html#details-geometry
      width: 1000,                
      height: 1000, 

      // Crop the image to the changed dimensions
      // Crop field is required for graphicsmagick to work
      // More info in graphicsmagick doc: http://www.graphicsmagick.org/GraphicsMagick.html#details-crop
      crop: {                   
        width: 1000,
        height: 1000,
        x: 0,
        y: 0
      },
    },
    s3 : {
      ACL: 'public-read'          // Allow image to be publicly read
    },
    filename: function (req, file, cb) {
      cb(null, Date.now().toString())         // Set file key to be the current date and time
    }
  })
})

module.exports = upload;