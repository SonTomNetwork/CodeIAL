const passport = require('passport');
const express = require('express');
const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/users');

passport.use(new LocalStrategy({
    usernameField: 'email',
    passReqToCallback: true
},
    function (req, email, password, done) {
        User.findOne({ email: email }, function (err, user) {
            if (err) {
                req.flash('error', err);
                return done(err);
            }

            if (!user || user.password != password) {
                req.flash('error', 'Invalid username or password');
                return done(null, false);
            }

            return done(null, user);
        });
    }
));

passport.serializeUser(function (user, done) {
    done(null, user.id);
});
passport.deserializeUser(function (id, done) {
    User.findById(id, function (err, user) {
        if (err) {
            console.log('Error in finding user --> Passport');
            return done(err);
        }
        return done(null, user.id);
    });
});

passport.checkAuthentication = function (req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    return res.redirect('/users/sign-in');
};

passport.setAuthenticatedUser = async function (req, res, next) {
    if (req.isAuthenticated()) {
        res.locals.user = await User.findById(req.user, function (err, user) {
            if (err) {
                console.log('Error in finding user --> Passport');
            }
            return;
        });
    }

    next();
}

module.exports = passport;