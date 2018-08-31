var express = require("express");
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var exphbs = require('express-handlebars');
var expressValidator = require('express-validator');
var flash = require('connect-flash');
var session = require('express-session');
var config = require('./config/');
var jwt = require('jsonwebtoken');
var logger = require('morgan');

var routes = require('./routes/');
var users = require('./routes/users');
var admin = require('./routes/admin');
//var boats = require('./routes/boats');

var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

// mongoose
var mongoose = require('mongoose');
//connect to the database using mongoose
mongoose.connect(config.database);
var db = mongoose.connection;

// Initialize app
var app = express();

var boatsApi = require('./routes/api/boats');
var tokensApi = require('./routes/api/tokens');
var userApi = require('./routes/api/user');

app.use(logger('dev'));

// View Engine
app.set('views', path.join(__dirname, 'views'));
app.engine('handlebars', exphbs({defaultLayout: 'layout'}));
app.set('view engine', 'handlebars');

// BodyParser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());

// set static folder
app.use(express.static(path.join(__dirname, 'public')));

// express session
app.use(session({
    secret: 'hokuspokus',
    resave: true,
    saveUninitialized: true
}));

// passport initialization
app.use(passport.initialize());
app.use(passport.session());

// bring in passport strategy we defined
require('./config/passport')(passport);

// express validator
app.use(expressValidator({
    errorFormatter: function(param, msg, value) {
        var namespace = param.split('.');
        var root = namespace.shift();
        var formParam = root;

        while(namespace.length) {
            formParam += '[' + namespace.shift() + ']';
        }

        return {
            param: formParam,
            msg: msg,
            value: value
        }
    }
}));

// connect flash middleware
app.use(flash());

// global vars
app.use(function(req, res, next) {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    res.locals.user = req.user || null;
    next();
});

// enable CORS
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Credentials", "true");
    res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,PATCH,POST,PUT");
    res.header("Access-Control-Allow-Headers", "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers, Authorization");

    next();
});

app.use('/', routes);
app.use('/users', users);
app.use('/token', tokensApi);
app.use('/api', boatsApi);
app.use('/api', userApi);
app.use('/admin', admin);

// set passport
app.set('port', config.port);

app.listen(app.get('port'), function() {
    console.log('Server started on port ' + app.get('port'));
}) 