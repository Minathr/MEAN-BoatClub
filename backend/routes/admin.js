var express = require('express');
var router = express.Router();

var Boats = require('../models/boats');
var Users = require('../models/user');

// get admin's dashboard page
router.get('/', ensureAuthenticated, ensureIsAdmin, function(req, res) {
    res.render('adminDashboard');
});

function setUserInfo(request) {
    return {
      username: request.username,
      password: request.password
    };
};

//get filtered user list
router.get('/filtereduserlist', ensureAuthenticated, ensureIsAdmin, function(req, res) {
    Users.find(function(err, user) {
        if (err)
            res.send(err);

        let usersInfo=[];
        for (var i in user) {
            usersInfo[i] = setUserInfo(user[i]);
        }
        //console.log('**************'+ {usersInfo});
        res.render('filtereduserlist', {usersInfo});
    });
});

//get unfiltered user list
router.get('/userlist', ensureAuthenticated, ensureIsAdmin, function(req, res) {
    Users.find(function(err, user) {
        if (err)
            res.send(err);

        //console.log('**************'+ {usersInfo});
        res.render('userlist', {user});
    });
});

//get map
router.get('/map', function(req, res) {
    res.render('map');
  });

//get boats list
router.get('/boats', ensureAuthenticated, ensureIsAdmin, function(req, res) {
    Boats.find(function(err, boats) {
        if (err)
            res.send(err);

        //res.json(boats);
        console.log('**************boats: '+ {'boats': boats}.boats);
        res.render('boatlist', {boats});
    });
});


// get one boat
router.get('/boats/:id', ensureAuthenticated, ensureIsAdmin, function(req, res) {
    Boats.findById(req.params.id, function(err, boat) {
        if (err)
            res.send(err);
        console.log('**************boat: '+ boat);
        res.render('updateboat', boat);
    });
});

router.get('/boat/add', ensureAuthenticated, ensureIsAdmin, function(req, res) {
    res.render('addboat');
});

// add boat
router.post('/boat/add', ensureAuthenticated, ensureIsAdmin, function(req, res) {
    var newBoat = new Boats();  

    if (!req.body.boatname || !req.body.boatlengthinfeet || !req.body.boatyear || !req.body.boatcapacityinpeople || !req.body.boatpictureurl) {
        res.status(400);
        res.render('addboat',
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
            res.redirect('/admin/boats');
        });   
    } 
});

// update boat
router.post('/boat/update/:id', ensureAuthenticated, ensureIsAdmin, function(req, res) {

    if (!req.body.boatname 
            || !req.body.boatlengthinfeet 
            || !req.body.boatyear
            || !req.body.boatcapacityinpeople
            || !req.body.boatpictureurl) {
        res.status(400);
        res.render('updateboat',
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
                res.redirect('/admin/boats');
            });
        });
    }
});

// delete boat data
router.get('/boat/delete/:id', ensureAuthenticated, ensureIsAdmin, function(req, res) {
    Boats.remove({
        _id: req.params.id
    }, function(err, boats) {
        if (err) res.send(err);

        res.redirect('/admin/boats');
    });
});

function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    } else {
        req.flash('error_msg', "You are not logged in");
        res.redirect('/users/login');
    }
}

function ensureIsAdmin(req, res, next) {
    if (req.user.role === 'admin') {
        return next();
    } else {
        req.flash('error_msg', "You are not aithorized to see this page.");
        res.redirect('/');
    }
}

module.exports = router;