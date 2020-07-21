const passport = require('passport');
const JWTstrategy = require('passport-jwt').Strategy;
const extractJWT = require('passport-jwt').ExtractJwt;
const User = require('../models/users');

let opts = {
    jwtFromRequest: extractJWT.fromAuthHeaderAsBearerToken(),
    secretOrKey: 'codeial'
}

passport.use(new JWTstrategy(opts, function (JWTPayLoad, done) {
    User.findById(JWTPayLoad._id, function (err, user) {
        if (err) {
            console.log('User token error.');
            return;
        }
        if (user) {
            return done(null, user);
        }
        else {
            return done(null, false);
        }
    })
}));

module.exports = passport;