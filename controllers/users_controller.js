const User = require('../models/users.js');
const fs = require('fs');
const path = require('path');

module.exports.profile = function (req, res) {
    User.findById(req.params.id, function (err, user) {
        return res.render('user_profile', {
            title: "User",
            profile_user: user
        });
    });
};

module.exports.update = async function (req, res) {
    if (req.user == req.params.id) {
        try {
            let user = await User.findById(req.params.id);
            User.uploadedPFP(req, res, function (err) {
                if (err) {
                    console.log('Multer Error: ', err);
                }

                user.name = req.body.name;
                user.email = req.body.email;
                if (req.file) {
                    if (user.pfp) {
                        fs.unlinkSync(path.join(__dirname + '/..' + user.pfp));
                    }
                    user.pfp = User.pfpPath + '/' + req.file.filename;
                }

                user.save();
                return res.redirect('back');
            });
        } catch (err) {
            req.flash('error', err);
            return res.redirect('back');;
        }
    }
    else {
        req.flash('error', 'Unauthorised.');
        return res.status(401).send('Unauthorised.');
    }
};

module.exports.signUp = function (req, res) {
    if (req.isAuthenticated()) {
        return res.redirect('/users/profile');
    }
    return res.render('user_sign_up', {
        title: 'Sign Up'
    })
};
module.exports.signIn = function (req, res) {
    if (req.isAuthenticated()) {
        return res.redirect('/users/profile');
    }
    return res.render('user_sign_in', {
        title: 'Sign In'
    })
};

module.exports.create = function (req, res) {
    if (req.body.password != req.body.confirm_password) {
        return res.redirect('back');
    }
    User.findOne({ email: req.body.email }, function (err, user) {
        if (err) {
            console.log('Error in signing up.');
            return
        }
        if (!user) {
            User.create(req.body, function (err, user) {
                if (err) {
                    console.log('Error in creating user.');
                    return
                }
                return res.redirect('/users/sign-in');
            });
        }
        else {
            return res.redirect('back');
        }
    });
};

module.exports.createSession = function (req, res) {
    req.flash('success', 'Logged in successfully.');
    return res.redirect('/');
};
module.exports.destroySession = function (req, res) {
    req.logout();
    req.flash('success', 'Logged out successfully.');
    return res.redirect('/');
};