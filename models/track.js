var mongoose = require('mongoose');

// Track Schema
var TrackSchema = mongoose.Schema({
    id: {
        type: String,
        index:true
    },
    name: {
        type: String
    }
});

var Track = module.exports = mongoose.model('Track', TrackSchema);

module.exports.createTrack = function(newTrack, callback){
      newTrack.save(callback);
}




