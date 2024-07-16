const multer = require('multer');
const path = require('path');

//Destination to store the images
const imageStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    let folder = ""
    if(req.baseUrl.includes('users')){
      folder = 'users';
    }else if(req.baseUrl.includes('pets')){
      folder = 'pets';
    }

    cb(null, `public/images/${folder}`);
  },
  fileName: function (req, file, cb) {
    cb(null, Date.now() + String(Math.floor(Math.random() * 10)) + path.extname(file.originalname));
  }
});

const imageUploader = multer({
  storage: imageStorage,
  fileFilter: (req, file, cb) => {
    if(!file.originalname.match(/\.(jpg|png)$/)){
      return cb(new Error("Por Favor!, envie apenas jpg ou png!"))
    }
    cb(undefined, true)
  }
});

module.exports = { imageUploader };