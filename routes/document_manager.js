let express = require("express");
let fs = require('fs');
let path = require('path');
let router = express.Router();
let pathToDocs = path.join(__dirname, '../');
let multer  = require('multer')
//==============
//Modules
//==============
// let getTime  = require("../modules/getDateTime").curTime;
// let getDate  = require("../modules/getDateTime").curDate;
// let getError = require("../modules/exception_viewer").newError;

router.get("/api", (req, res) => {
    fs.readdir(`${pathToDocs}/public/files/`, (err, files) => {
        res.send(JSON.stringify(files))
    });
});

router.get("/", (req, res) => {
    res.render("index");
});

router.get("/upload", (req ,res) => {
    res.render("upload");
});

const storage = multer.diskStorage({
    destination: 'public/files',
    filename: function(req, file, cb) {
        cb(null, file.originalname);
    }
});

async function checkFileType(file, cb) {
    // Allowed file ext
    // const fileTypes = /txt|docx|xlsx|pdf|text/;
    const fileTypes = ['.txt', '.docx', '.pdf', '.xlsx', 'text'];
    
    // console.log(fileTypes.test('test.text'));
    // Check file ext
    const extname = path.extname(file.originalname).toLowerCase();
    // check mimetype
    // const mimetype = fileTypes.test(file.mimetype);
    console.log(file.mimetype);
    let promise = new Promise((resolve, reject) => {
        fs.readdir(`${pathToDocs}/public/files/`, (err, files) => {
        if(err){return reject(err)};
        if(files) return resolve(files);
        });
    });
    let results = await promise;
    if(fileTypes.includes(extname) && !results.includes(file.originalname)) {
        return cb(null, true);
    } else {
        cb('Error: Invalid error');
    }
};

function checkExistingFile() {
    fs.readdir(`${pathToDocs}/public/files/`, (err, files) => {
        for(var i = 0; i < files.length; i++) {
            return files;
        }
    });
}

const upload = multer({
    storage: storage,
    fileFilter: function (req, file, cb) {
        checkFileType(file, cb);
    }
}).single('file');
//User .array for uploading multiple files.

router.post("/", (req, res) => {
    upload(req, res, (err) => {
        if(err){
            req.flash('error', 'Error uploading your file. Invalid or duplicate file type was detected.');
            res.redirect('back');
        } else {
            req.flash('success', `File ${req.file.originalname} was uploaded successfully!`)
            res.redirect('back');
        }
    });
});

router.post('/delete', (req, res) => {
    let file = req.body.file;
    fs.unlink(`${pathToDocs}/public/files/${file}`, (err, files) => {
        if(err) {
            req.flash('error', JSON.stringify(err));
            res.redirect('back');
        } else {
            req.flash('info', `File ${file} was deleted successfully!`);
            res.redirect('back');
        }
   });
});

module.exports = router;
