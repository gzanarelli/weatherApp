var express = require('express');
var router = express.Router();
var UserModel = require('../models/user');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});


const addUser = (email) => {
  
}

// POST Sign Up
router.post('/signup', function(req, res) {
  UserModel.findOne({email: req.body.emailFromFront}, async function(err, data) {
    console.log(data);
    if (err) console.log(err);
    if (data)
      res.redirect('/');
    else {
      let newUser = await new UserModel({
        username: req.body.usernameFromFront,
        email: req.body.emailFromFront,
        password: req.body.passwordFromFront
      });
      newUser.save(function(err) {
        if (err)
          res.redirect('/');
        else {
          req.session.user = newUser;
          res.redirect('/cities');
        }
      })
    }
  })
});


//POST Sign In
router.post('/signin', function(req, res) {
  UserModel.findOne({email: req.body.emailFromFront, password: req.body.passwordFromFront}, function(err, data) {
    if (err) console.log(err);
    if (data) {
      req.session.user = data;
      res.redirect('/cities');
    }
    else
      res.redirect('/');
  })
});


// GET Logout
router.get('/logout', function(req, res) {
  req.session.user = null;
  res.redirect('/');
});

module.exports = router;
