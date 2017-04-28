const express = require("express");
const router = express.Router();
const mongoose = require('mongoose');
const models = require('./../models');
const User = mongoose.model('User');
const helpers = require('./../helpers');
const h = helpers.registered;

// ----------------------------------------
// Registration
// ----------------------------------------
router.get("/new", (req, res) => {
  res.render("users/new");
})

// ----------------------------------------
// Create User
// ----------------------------------------
router.post("/", (req, res, next) => {
  let userParams = {
    fname: req.body.user.fname,
    lname: req.body.user.lname,
    email: req.body.user.email,
    password: req.body.user.password
  };

  User.create(userParams)
    .then((user) => {
      req.flash('success', 'User created.');
      res.redirect("/users/show");
    })
    .catch((e) => {
      if (e.errors) {
        Object.keys(e.errors).forEach((key) => {
          req.flash('error', `${ e.errors[key].message }`);
          res.redirect(req.session.backUrl);
        });
      } else {
        next(e);
      }
    });
})

// ----------------------------------------
// Show
// ----------------------------------------
router.get('/show', (req, res) => {
  res.render('users/show');
});

module.exports = router;
