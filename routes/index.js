var express = require('express');
var fs = require('fs');
var router = express.Router();
let async = require('async');
var querystring = require("querystring");
var multer = require('multer')
var upload = multer({
    dest: 'upload/'
});
const gm = require('gm').subClass({
    imageMagick: true
});
var firebase = require("firebase");

var config = {
    apiKey: "AIzaSyD6AKUXXDH9bXoLLXbJAmLiILlTfVjrnFI",
       authDomain: "todo-list-dcard.firebaseapp.com",
       databaseURL: "https://todo-list-dcard.firebaseio.com",
       projectId: "todo-list-dcard",
       storageBucket: "",
       messagingSenderId: "249258018066"
};

firebase.initializeApp(config);
var db = firebase.database();
var ref = db.ref("/todo");





router.get('/', function(req, res, next) {
    res.render('index');
});


router.get('/upload', function(req, res, next) {
    res.render('upload', {
        upload_name: 'Upload File'
    });
});
router.get('/todo', function(req, res, next) {
    let data = [];

    ref.once("value", function(snapshot) {
        snapshot.forEach(function(item){
            let t = item.val();
            let temp = {
                key: item.key,
                item: t.item,
                status: t.status
            };
            data.push(temp);
        });
        res.render('todo', {
            todo: data
        });
    });

});

router.post('/ajax_add_todo', function(req, res, next) {

    async.series([function(callback) {
        ref.push({item: req.body.item,status: Number(req.body.status)});
        ref.once('child_added', function(snapshot) {
            let key = snapshot.key;
            var message = snapshot.val();
            let data = {
                key: key,
                item: message.item,
                status: message.status
            };
            res.json({
                status: true,
                msg: 'success',
                todo: data
            });
          });
    }]);
});

router.post('/ajax_delete_todo', function(req, res, next) {
    ref.child(req.body.key).remove();
    res.json({
        status: true
    });
});

router.post('/ajax_change_status', function(req, res, next) {
    ref.child(req.body.key).set({item: req.body.item, status: Number(req.body.status)});
    res.json({
        status: true
    });
});

router.post('/ajax_change_text', function(req, res, next) {
    ref.child(req.body.key).set({item: req.body.item, status: Number(req.body.status)});
    res.json({
        status: true
    });
});

router.post('/ajax_save', upload.single('file'), function(req, res, next) {
    var file = req.file;
    console.dir(req.file);
    console.dir(req.body);
    console.dir(req.file.path);
    let mime = req.file.mimetype.split('/')[1];
    let path = req.file.path + '.' + mime;
    let width = req.body.width;
    let height = req.body.height;
    const imagePath = req.file ? req.file.path : null;
    gm(imagePath)
        .resize(Number(req.body.width), Number(req.body.height), '!')
        .quality(100)
        .write('public/src/' + req.file.filename + '.png', function(err) {
            if (!err) {
                console.log('done');
                let fileName = req.file.filename + '.png';
                res.json({
                    status: true,
                    filename: fileName,
                    width: width,
                    height: height
                });
            } else {
                console.log(err);
                res.json({
                    status: false,
                    msg: err
                });
            }
        });
});

module.exports = router;
