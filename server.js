var express = require('express');
var app = express();
var morgan = require('morgan');
var session = require('express-session');
var bodyParser = require('body-parser');
var mongoose = require('mongoose'); 
var passport = require('passport');


mongoose.connect('mongodb://localhost:27017/homeserver');
app.use(morgan('dev'));
app.use(bodyParser.json()); // parse application/json
app.use(bodyParser.urlencoded({extended:true})); // parse application/x-www-form-urlencoded
app.use(session({secret:"shubham",
				 saveUninitialized:true,
				 resave:true}));

app.use(passport.initialize());
app.use(passport.session());


//PASSPORT CONFIGURATION ---> SHOULD BE DONE SEPERATE FROM THIS SERVER.JS .....


var User = require('./app/models/user');
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
// used to serialize the user for the session
passport.serializeUser(function(user, done) {
	// console.log(user);
    done(null, user.id);
});

// used to deserialize the user
passport.deserializeUser(function(id, done) {
    User.findOne({id:id}, function(err, user) {
    	// console.log(user);
        done(err, user);
    });
});

// --SHUBHAM-- PLEASE USE YOUR OWN CLIENTID AND SECRET BY REGISTERING ON DEV CONSOLE -----.
// WARNING - DONT FORGET TO ENABLE GOOGLe+ API  -- REGARDS SHUBHAM--------
passport.use(new GoogleStrategy({

    clientID        : "dummyid",
    clientSecret    : "dummyid",
    callbackURL     : "http://localhost:3000/auth/google/callback",

},
function(token, refreshToken, profile, done) {

    // make the code asynchronous
    process.nextTick(function() {

        // try to find the user based on their google id
        User.findOne({ 'id' : profile.id }, function(err, user) {
            if (err)
                return done(err);

            if (user) {
                return done(null, user);
            } else {
              
                var newUser	= new User();

                // set all of the relevant information
                newUser.id    = profile.id;
                newUser.token = token;
                newUser.name  = profile.displayName;
                newUser.email = profile.emails[0].value; // pull the first email

                // save the user
                newUser.save(function(err) {
                    if (err)
                        throw err;
                    return done(null, newUser);
                });
            }
        });
    });

}));



var routes = require('./app/routes.js');
routes(app,passport);


app.listen(3000,function(){
	console.log("listening at 3000 .......");
})