
var express = require('express');
var router = express.Router();


var Track = require('../models/track');

router.get('/tracks', function(req, res){
    res.render('index');
});

router.post('/', function(req, res) {
    var id = req.body.id;
    var name = req.body.name;


    var newTrack = new Track({
        id: id,
        name: name
    });


    Track.createTrack(newTrack, function (err, track) {
        if (err) throw err;
        console.log(track);
    });


    res.render('index', {
        id: Track.id,
        name: Track.name
    });
});

    module.exports = router;

