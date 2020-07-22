const passport = require('passport');
const googleStrategy = require('passport-google-oauth').OAuth2Strategy;
try {
    const crypto = require('crypto');
} catch (err) {
    console.log('crypto support is disabled!');
}
const crypto = require('crypto');
const User = require('../models/users');

passport.use(new googleStrategy({
    clientID: '865167019410-eq7qcjmq5kg8vddkavi1kbu2mg9oj70o.apps.googleusercontent.com',
    clientSecret: '_NRpyaKntQoTkmgZ87KdV0XQ',
    callbackURL: 'http://localhost:8000/users/auth/google/callback',
},

    function (accessToken, refreshToken, profile, done) {
        User.findOne({ email: profile.emails[0].value }).exec(function (err, user) {
            if (err) {
                console.log('Error in Google strategy - passport:', err);
                return;
            }

            console.log(profile);

            if (user) {
                return done(null, user);
            }
            else {
                User.create({
                    name: profile.displayName,
                    email: profile.emails[0].value,
                    password: crypto.randomBytes(20).toString('hex')
                }, function (err, user) {
                    if (err) {
                        console.log('Error in creating user:', err);
                        return;
                    }
                    return done(null, user);
                });
            }
        });
    }
));

module.exports = passport;