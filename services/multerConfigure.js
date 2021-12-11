'use strict';

const path = require('path');
const multer = require('multer');
const util = require('util');

//Define save route and filename
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './public/images/advertisements/');
  },

  filename: (req, file, cb) => {
    cb(
      null,
      file.fieldname + '-' + Date.now() + path.extname(file.originalname)
    );
  },
});

const typesValidFilesFilter = (req, file, cb) => {
  if (
    file.mimetype === 'image/jpeg' ||
    file.mimetype === 'image/jpg' ||
    file.mimetype === 'image/png' ||
    file.mimetype === 'image/webp' ||
    file.mimetype === 'image/bmp' ||
    file.mimetype === 'image/tiff' ||
    file.mimetype === 'image/gif'
  ) {
    // Accept file
    cb(null, true);
  } else {
    // No accept file
    cb(null, false);
  }
};

//create multer with new storage properties
const uploadFile = multer({
  storage: storage,
  fileFilter: typesValidFilesFilter,
}).single('photo');

module.exports = uploadFile;
