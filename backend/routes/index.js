var express = require('express');
var router = express.Router();
var Boats = require('../models/boats');

// get home page
router.get('/', ensureAuthenticated, function(req, res) {
    var isAdmin = false;
    if (req.user.role === 'admin') {
        res.redirect('/admin');
    } else {
        Boats.find(function(err, boats) {
        if (err)
            res.send(err);

            //res.json(boats);
            console.log('**************boats: '+ {'boats': boats}.boats);
            res.render('userboatlist', {boats});
        });
    }
});

function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    } else {
        req.flash('error_msg', "You are not logged in");
        res.redirect('/users/login');
    }
}

module.exports = router;