const express = require("express");
const router = express.Router();
const multer  = require('multer');
const mongoose = require("mongoose");
const gridFsStorage = require("multer-gridfs-storage");
const gridStream = require("gridfs-stream");
const keys = require("../config/keys");
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const crypto = require("crypto");
router.use(bodyParser.json());
router.use(methodOverride('_method'));
//==============
//Modules
//==============
let getTime  = require("../modules/curr_date").curTime;
let getDate  = require("../modules/curr_date").curDate;

let conn = mongoose.createConnection(keys.mongo.dbURI, { useNewUrlParser: true })
let gfs;

conn.once('open', (req, res) => {
    gfs = gridStream(conn.db, mongoose.mongo);
    gfs.collection('uploads');
});

const storage = new gridFsStorage({
    url: keys.mongo.dbURI,
    file: (req, file) => {
        return {
            filename: file.originalname,
            bucketName: 'uploads',
        }
    }
});
const upload = multer({
     storage: storage
}).single('file');

router.get("/api", (req, res) => {
    gfs.files.find().toArray((err, files) => {
        if(err) {
            console.log(err);
        } else {
            res.send({ files: files });
        }
    });
});

router.get("/", (req, res) => {
    gfs.files.find().toArray((err, files) => {
        if(err) {
            console.log(err);
        } else {
            res.render("index", { files: files });
        }
    });
});

router.get("/upload", (req ,res) => {
    res.render("upload");
});

router.post("/", (req, res) => {
    upload(req, res, (err) => {
        if(err){
            console.log(err);
            req.flash('error', 'Error uploading your file. Server error, invalid or duplicate file was detected.');
            res.redirect('back');
        } else {
            req.flash('success', `File ${req.file.originalname} was uploaded successfully!`)
            res.redirect('back');
        }
    });
});

router.get('/files/:filename', (req, res) => {
    gfs.files.findOne({ filename: req.params.filename }, (err, file) => {
      // Check if file
      if (!file || file.length === 0) {
        return res.status(404).json({
          err: 'No file exists'
        });
      }
      // File exists
      return res.json(file);
    });
  });

router.delete('/files/:id', (req, res) => {
    let filename = req.body.filename;
    gfs.remove({ _id: req.params.id, root: 'uploads' }, (err, gridStore) => {
      if (err) {
        return res.status(404).json({ err: err });
      }
      req.flash('success', filename + " was successfully deleted.");
      res.redirect('/');
    });
  });

module.exports = router;
