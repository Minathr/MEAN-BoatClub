var express = require('express'); 
var router = express.Router();
var passport = require('passport');

var Users = require('../../models/user');

router.get('/user', function(req, res) {
    Users.find(function(err, user) {
        if (err)
            res.send(err);

        res.json(user);
    });
});


router.get('/user/:id', function(req, res) {
    Users.findById(req.params.id, function(err, user) {
        if (err)
            res.send(err);

        let userInfo = setUserInfo(user);
        res.json(userInfo);
    });
});

module.exports = router;