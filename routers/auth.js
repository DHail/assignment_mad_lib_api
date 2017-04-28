const express = require("express");
const router = express.Router();
const mongoose = require('mongoose');
const models = require('./../models');
const User = mongoose.model('User');
const helpers = require('./../helpers');
const h = helpers.registered;
const url = require('url');
const SessionService = require('../services/session');

// ----------------------------------------
// Authentication
// ----------------------------------------
router.use((req, res, next) => {
  if (!req.session.sessionId) {
    next();
    return;
  }

  const [ email, signature ] = req.session.sessionId.split(":");

  User.findOne({ email })
    .then(user => {
      if (signature === SessionService.createSignature(email)) {
        req.user = user;
        res.locals.currentUser = user;
        next();
      } else {
        res.redirect(h.loginPath());
      }
    })
    .catch(next);
});

// ----------------------------------------
// Require Login/Logout
// ----------------------------------------
const _unauthenticatedPaths = [
  '/login',
  '/logout',
  '/sessions',
  '/users/new',
  '/users'
];

router.use((req, res, next) => {
  const reqUrl = url.parse(req.url).pathname;
  const isLoggedIn = !!req.user;
  const isAuthenticatedPath = !_unauthenticatedPaths.includes(reqUrl);

  const canProceed =
    (isLoggedIn && isAuthenticatedPath) ||
    !isAuthenticatedPath;

  canProceed ?
    next() :
    res.redirect(h.loginPath());
});

// ----------------------------------------
// New
// ----------------------------------------
const onNew = (req, res) => {
  req.user ?
    res.redirect("/") :
    res.render('sessions/new');
};

router.get('/login', onNew);
router.get('/sessions/new', onNew);

// ----------------------------------------
// Create
// ----------------------------------------
router.post('/sessions', (req, res, next) => {
  const { email, password } = req.body;

  User.findOne({ email })
    .then(user => {
      if (user) {
        if (user.validatePassword(password)) {
          const sessionId = SessionService.createSignedSessionId(user.email);
          req.session.sessionId = sessionId;
          res.redirect('/');
        } else {
          res.redirect(h.loginPath());
        }
      } else {
        res.redirect(h.loginPath());
      }
    })
    .catch(next);
});

// ----------------------------------------
// Destroy
// ----------------------------------------
const onDestroy = (req, res) => {
  req.session = null;
  req.method = 'GET';
  res.redirect("sessions/new");
};

router.get('/logout', onDestroy);
router.delete('/logout', onDestroy);
router.delete('/sessions', onDestroy);



module.exports = router;
