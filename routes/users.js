var express = require('express');
var router = express.Router();
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

var User = require('../models/user');

// Register
router.get('/register', function(req, res){
    res.render('register');
});

// Login
router.get('/login', function(req, res){
    res.render('login');
});

router.get('/about', function(req, res){
    res.render('about');
});

// Register User
router.post('/register', function(req, res){
    var username = req.body.username;
    var password = req.body.password;
    var password2 = req.body.password2;
    var mobileNumber = req.body.mobileNumber;
    var email = req.body.email;

    // Validation
    req.checkBody('username', 'Username is required').notEmpty();
    req.checkBody('password', 'Password is required').notEmpty();
    req.checkBody('password2', 'Passwords do not match').equals(req.body.password);
    req.checkBody('mobileNumber', 'Mobile number is required').notEmpty();
    req.checkBody('email', 'Email is required').notEmpty();
    req.checkBody('email', 'Email is not valid').isEmail();


    var errors = req.validationErrors();

    if(errors){
        res.render('register',{
            errors:errors
        });
    } else{
        var newUser = new User({
            username: username,
            password: password,
            mobileNumber: mobileNumber,
            email:email
        });

        User.createUser(newUser, function(err, user){
            if(err) throw err;
            console.log(user);
        });

       res.redirect('/');
    }
});

passport.use(new LocalStrategy(
    function(username, password, done) {
        User.getUserByUsername(username, function(err, user){
            if(err) throw err;
            if(!user){
                return done(null, false, {message: 'Unknown User'});
            }

            User.comparePassword(password, user.password, function(err, isMatch){
                if(err) throw err;
                if(isMatch){
                    return done(null, user);
                } else {
                    return done(null, false, {message: 'Invalid password'});
                }
            });
        });
    }));

passport.serializeUser(function(user, done) {
    done(null, user.id);
});

passport.deserializeUser(function(id, done) {
    User.getUserById(id, function(err, user) {
        done(err, user);
    });
});


router.post('/login',
    passport.authenticate('local', {successRedirect:'/', failureRedirect:'/users/login',failureFlash: true}),
    function(req, res) {
        res.redirect('/');
    });

router.get('/logout', function(req, res){
    req.logout();
    req.flash('success_msg', 'You are logged out');
    res.redirect('/users/about');
});


module.exports = router;