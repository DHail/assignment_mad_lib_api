const express = require("express");
const router = express.Router();
const mongoose = require('mongoose');
const models = require('./../models');
const User = mongoose.model('User');
const helpers = require('./../helpers');
const h = helpers.registered;

router.get("/new", (req, res) => {
  res.render("users/new");
})

router.post("/", (req, res) => {
  let userParams = {
    fname: req.body.user.fname,
    lname: req.body.user.lname,
    email: req.body.user.email,
    password: req.body.user.password
  };

  User.create(userParams)
    .then((user) => {
      req.flash('success', 'User created! You may now login.');
      res.redirect("/sessions/new");
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

module.exports = router;