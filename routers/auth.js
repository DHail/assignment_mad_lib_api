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
// Authorize
// ----------------------------------------
router.use('/api', (req, res, next) => {

  // Get API token from query or body
  const token = req.query.token || req.body.token;
  req.token = token;

  // If we don't have a token
  // kick'em out
  if (!token) {
    res
      .status(401)
      .json({ error: 'Unauthorized' });
    return;
  }

  // If we have a token find the
  // user by that token
  User.findOne({token})
    .then((user) => {

      // Set the request user
      req.user = user;
      next();
    })
    .catch(next);
});

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
