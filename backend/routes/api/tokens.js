var express = require('express');
var apiRoutes = express.Router();
var jwt = require('jsonwebtoken');
var config = require('../../config/');

var User = require('../../models/user');

// Register new users
apiRoutes.post('/register', function(req, res) {
    if (!req.body.username || !req.body.password ||
        !req.body.email || !req.body.firstname ||
        !req.body.lastname || !req.body.street ||
        !req.body.city || !req.body.province ||
        !req.body.postalcode || !req.body.country) {
        res.json({
            success: false,
            message: 'Please complete the form.'
        });
    } else {
        var newUser = new User({
            username: req.body.username,
            password: req.body.password,
            email: req.body.email,
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            address: {
                street: req.body.street,
                city: req.body.city,
                province: req.body.province,
                postalcode: req.body.postalcode,
                country: req.body.country
            }
        });

        console.log(newUser);
	 // Attempt to save the new user
        User.createUser(newUser, function(err, user) {
            if (err) {
                console.log('Email already exists');
                return res.json({
                    success: false,
                    message: "Email already exists."
                });
            }
            console.log('user created');
            res.json({
                success: true,
                message: 'Successfully created new user.'
            })
        });
    }
});

// authenticate user and obtain token NB: /token/authenticate important...email not username
apiRoutes.post('/authenticate', function(req, res) {
    User.getUserByUsername(req.body.username, function(err, user) {
        if (err) throw err;

        if (!user) {
            res.status(400).send('Username or password is incorrect');
            /*res.send({ 
                success: false,
                message: 'Authentication failed. User not found'
            });*/
        } else {
		 // check that password matches
            User.comparePassword(req.body.password, user.password, function(err, isMatch) {
                if (isMatch && !err) {
                    // create token
                    var token = jwt.sign({data:user}, config.secret, {
                        expiresIn: 10080 // week in seconds
                    });

                    /* This works too
                    var token = jwt.sign(user.toJSON(), config.secret, {
                        expiresIn: 10080 // week in seconds
                    });
                    */

                    res.json({ _id: user._id,
                        username: user.username,
                        firstname: user.firstname,
                        lastname: user.lastname,
                        role: user.role,
                        token: token
                    });
                } else {
                    res.status(400).send('Username or password is incorrect');
                }
            });
        }
    });
});

module.exports = apiRoutes;