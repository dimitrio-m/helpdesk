const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/User');

module.exports = function(passport) {

  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
        done(err, user);
    });
  });

  passport.use('local-login', new LocalStrategy({
    usernameField : 'email',
    passwordField : 'password',
    passReqToCallback : true,
  },
  function(req, email, password, done) {
    User.findOne({ 'email' :  email.toLowerCase() }, function(err, user) {
      if (err) {
        return done(err);
      }
      if (!user) {
        return done(null, false, req.flash('loginMessage', 'Δεν βρέθηκε ο χρήστης.'));
      } 
      if (!user.comparePassword(password)) {
        return done(null, false, req.flash('loginMessage', 'Λάθος κωδικός.'));
      }
      user.currentStore = req.body.store;
      return done(null, user);
    });    
  }));
};
