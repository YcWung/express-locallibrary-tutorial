var User = require("../models/user");
var bcrypt = require('bcryptjs');
var passport = require('passport');
var validator = require('express-validator');
var debug = require('debug')('local-library:userController');

exports.user_sign_up_get = function (req, res, next) {
  res.render('user_sign_up_form', {});
};

exports.user_sign_up_post = [
  validator.body('username').trim().isLength({ min: 3 }).withMessage('username length at least 3')
    .isLength({ max: 30 }).withMessage('username length at most 30'),
  validator.body('password').isLength({ min: 3 }).withMessage('password length at lest 3')
    .isLength({ max: 30 }).withMessage('password length at most 30'),

  validator.body('username').escape(),

  function (req, res, next) {
    const errors = validator.validationResult(req);
    if (!errors.isEmpty()) {
      debug('sign_up_form errors = %j', errors);
      res.render('user_sign_up_form', { user: { username: req.body.username, password: req.body.password }, errors: errors.array() });
      return;
    }
    bcrypt.hash(req.body.password, 10, (err, hashed_password) => {
      if (err) {
        return next(err);
      }
      const user = new User({
        username: req.body.username,
        password: hashed_password
      });
      user.save(err => {
        if (err) return next(err);
        res.redirect('/catalog');
      });
    });
  }
];

exports.user_log_in_get = function (req, res, next) {
  res.render('user_log_in_form', {});
};

exports.user_log_in_post = [
  validator.body('username').trim(),
  validator.body('username').escape(),

  // passport.authenticate('local'),

  (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
      debug('log-in-post auth err: %O', err);
      debug('log-in-post auth user: %O', user);
      debug('log-in-post auth info: %O', info);
      if (err){
        return next(err);
      }
      if (!user){
        res.render('user_log_in_form', {user: {username: req.body.username, password: req.body.password}, errors: [{msg: info}]});
        return;
      }
      req.login(user, (err) => {
        next(err);
      });
    })(req, res, next);
  },

  (req, res, next) => {
    debug("log-in post handler: req.user = " + JSON.stringify(req.user));
    // res.locals.currentUser = req.user;
    res.redirect('/');
    // res.send('logged in as ' + JSON.stringify(res.locals.currentUser));
  }
];
exports.user_log_out_post = function (req, res, next) {
  req.logout();
  res.redirect('/catalog');
};
