var User = require("../models/user");
var bcrypt = require('bcryptjs');
var passport = require('passport');
var debug = require('debug')('local-library:userController');

exports.user_sign_up_get = function (req, res, next) {
  res.render('user_sign_up_form', {});
};

exports.user_sign_up_post = function (req, res, next) {
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
};

exports.user_log_in_get = function (req, res, next) {
  res.render('user_log_in_form', {});
};

exports.user_log_in_post = [passport.authenticate('local'),
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
