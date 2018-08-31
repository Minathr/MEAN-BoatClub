var mongoose     = require('mongoose');

var BoatSchema   = new mongoose.Schema({
    id: {
        type: String
    },
    boatname: {
        type: String
    },
    boatlengthinfeet: {
        type: String,
    },
    boatyear: {
        type: String, 
    },
    boatcapacityinpeople: {
        type: String,
    },
    boatpictureurl: {
        type: String,
    }
});

module.exports = mongoose.model('boats', BoatSchema);
