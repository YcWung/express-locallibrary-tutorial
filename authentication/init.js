var User = require('../models/user');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var bcrypt = require('bcryptjs');
var debug = require('debug')('local-library:authentication');

function initPassport() {
  passport.use(new LocalStrategy((username, password, done) => {
    User.findOne({ username: username }, (err, user) => {
      debug('[done] db find user ' + JSON.stringify(user));
      if (err) return done(err);
      if (!user) return done(null, false, "Incorrect Username");
      bcrypt.compare(password, user.password, (err, is_valid) => {
        if (err) return done(err);
        if (!is_valid) return done(null, false, 'Invalid Password');
        debug('Authentication succeeded!');
        return done(null, user);
      });
    });
  }));
  passport.serializeUser(function (user, done) {
    done(null, user._id);
  });
  passport.deserializeUser(function (id, done) {
    User.findById(id, function (err, user) {
      debug('[done] db find user by id: ' + JSON.stringify(user));
      done(err, user);
    });
  });
}

module.exports = initPassport;