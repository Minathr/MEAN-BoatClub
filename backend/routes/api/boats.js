var express = require('express'); 
var router = express.Router();
var passport = require('passport');

var Boats = require('../../models/boats');

router.get('/boats', passport.authenticate('jwt', {session: false}), function(req, res) {
    Boats.find(function(err, boats) {
        if (err)
            res.send(err);

        //res.json(boats);
        //console.log('**************boats: '+ {'boats': boats}.boats);
        res.send(boats);
    });
});

/*
// get one boat
router.get('/boats/:id', passport.authenticate('jwt', {session: false}), function(req, res) {
    Boats.findById(req.params.id, function(err, boats) {
        if (err)
            res.send(err);
        res.json(boats);
    });
});

// add boat
router.post('/boats', function(req, res) {
    var newBoat = new Boats();  

    if (!req.body.boatname || !req.body.boatlengthinfeet || !req.body.boatyear || !req.body.boatcapacityinpeople || !req.body.boatpictureurl) {
        res.status(400);
        res.json(
            {error: "Bad data, could not insert boat data into database"}
        );
    } else {
        newBoat.boatname = req.body.boatname;
        newBoat.boatlengthinfeet = req.body.boatlengthinfeet;
        newBoat.boatyear = req.body.boatyear;
        newBoat.boatcapacityinpeople = req.body.boatcapacityinpeople;
        newBoat.boatpictureurl = req.body.boatpictureurl;


        
        // save the boat data and check for errors
        newBoat.save(function(err, data, numAffected) {
            if (err)
                res.send(err);

            //res.json({ message: 'Boat created!' });
            res.json(data);
        });   
    } 
});

// update boat
router.put('/boats/:id', function(req, res) {

    if (!req.body.boatname 
            || !req.body.boatlengthinfeet 
            || !req.body.boatyear
            || !req.body.boatcapacityinpeople
            || !req.body.boatpictureurl) {
        res.status(400);
        res.json(
            {error: "Bad data, could not update boat data."}
        );
    } else {
        Boats.findById(req.params.id, function(err, boats) {
            if (err) res.send(err);

            boats.boatname = req.body.boatname;
            boats.boatlengthinfeet = req.body.boatlengthinfeet;
            boats.boatyear = req.body.boatyear;
            boats.boatcapacityinpeople = req.body.boatcapacityinpeople;
            boats.boatpictureurl = req.body.boatpictureurl;

            console.log("BOATS: " + boats);

            // save the boat
            boats.save(function(err, data, numAffected) {
                if (err) res.send(err);

                //res.json({ message: 'Boat updated!' });
                res.json(data);
            });
        });
    }
});

// delete boat data
router.delete('/boats/:id', function(req, res) {
    Bouts.remove({
        _id: req.params.id
    }, function(err, boats) {
        if (err) res.send(err);

        res.json({ message: 'Successfully deleted boat' });
    });
});

function ensureIsAdmin(req, res, next) {
    if (req.user.role === 'admin') {
        return next();
    } else {
        req.flash('error_msg', "You are not aithorized to see this page.");
        res.redirect('/');
    }
}*/

module.exports = router;