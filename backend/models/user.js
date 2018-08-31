var mongoose = require('mongoose'); //import mongoose
var bcrypt = require('bcryptjs'); //bcrypt is required.

// user schema
var UserSchema = mongoose.Schema({
    username: {
        type: String,
        index: true
    },
    password: {
        type: String,
        required: true
    },
    email: {
        type: String,
        lowercase: true,
        unique: true,
        required: true
    },
    firstname: {
        type: String,
    },
    lastname:{
        type: String,
    },
    role: {
        type: String,
        enum: ['admin', 'member'], //two roles are allowed. Both member and admin.
        default: 'member'
    },
    address: {
        street: {
            type: String,
        },
        city: {
            type: String,
        },
        province: {
            type: String,
        },
        postalcode: {
            type: String,
        },
        country:{
            type: String,
        }
    },
    creationdate: {
        type: Date,      
        default: Date.now  
    }
});

//save the user's hashed password
var User = module.exports = mongoose.model('memberinfo', UserSchema); //NB:/users/login

module.exports.createUser = function(newUser, callback) {
    bcrypt.genSalt(10, function(err, salt) {
        bcrypt.hash(newUser.password, salt, function(err, hash) {
            newUser.password = hash;
            newUser.save(callback);
        });
    });
}

module.exports.getUserByUsername = function(username, callback) { 
    User.findOne({username: username}, callback); 
} 

module.exports.getUserById = function(id, callback) {
    User.findById(id, callback); 
}

module.exports.comparePassword = function(candidatePassword, hash, callback) {
    bcrypt.compare(candidatePassword, hash, function(err, isMatch) {
        if (err) throw err;
        callback(null, isMatch);
    });
}
