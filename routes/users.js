var express = require('express');
var router = express.Router();
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

var User = require('../models/user');

//Register
router.get('/register', function(req, res){
  res.render('register');
});

//Login
router.get('/login', function(req, res){
  res.render('/');
});


//Register User
router.post('/register', function(req, res){
  var nickname = req.body.nickname;
  var password = req.body.password;
  var password2 = req.body.password2;
  var mobileNumber = req.body.mobileNumber;
  var email = req.body.email;

  //Validation
  req.checkBody('nickname', 'Nickname is required').notEmpty();
  req.checkBody('password', 'Password is required').notEmpty();
  req.checkBody('password2', 'Password do not match').equals(req.body.password);
  req.checkBody('mobileNumber', 'Mobile Number is required').notEmpty();
 //  req.checkBody('mobileNumber', 'Mobile Number is not valid').isMobilePhone();
  req.checkBody('email', 'Email is required').notEmpty();
  req.checkBody('email', 'Email is not valid').isEmail();

  var errors = req.validationErrors();

  if(errors){
    res.render('register',{
      errors:errors
    });
  }else{
    var newUser = new User({
      nickname: nickname,
      email:email,
      mobileNumber:mobileNumber,
      password: password
    });

    User.createUser(newUser, function(err, users){
      if(err) throw err;
    //  console.log(user);
    });

    req.flash('success_msg', 'You are registered.......');

   res.redirect('/');
  }
});

passport.use(new LocalStrategy(
  function(nickname, password, done) {
   User.getUserByNickname(nickname, function(err, users){
   	if(err) throw err;
   	if(!users){
   		return done(null, false, {message: 'Unknown User'});
   	}

   	User.comparePassword(password, users.password, function(err, isMatch){
   		if(err) throw err;
   		if(isMatch){
   			return done(null, users);
   		} else {

   			return done(null, false, {message: 'Invalid password'});
   		}
   	});
   });
  }));

passport.serializeUser(function(users, done){
  done(null, users.id);
});

passport.deserializeUser(function(id, done){
  User.getUserById(id, function(err, users){
    done(err, users);
  });
})

router.post('/login',
  passport.authenticate('local', {successRedirect:'/', failureRedirect:'/users/register', failureFlash: true}),
function(req, res){
  res.redirect('/');
});


module.exports = router;
