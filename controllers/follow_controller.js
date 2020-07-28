const Follow = require('../models/follow');
const User = require('../models/users');

module.exports.create = async function (req, res) {
    try {
        let user = await User.findById(req.user);

        let follow = await Follow.create({
            from_user: req.user,
            to_user: req.body.followid
        });
        user.follow.push(follow.to_user);
        user.save();

        req.flash('success', 'Followed.');
        return res.redirect('back');
    } catch (err) {
        req.flash('error', 'Could not be followed.');
        console.log('Error:', err);
        return res.redirect('back');
    }
}

module.exports.destroy = async function (req, res) {
    try {
        let follow = await Follow.findOne({ to_user: req.params.id });

        if (follow.from_user == req.user) {
            let userID = follow.from_user;
            follow.deleteOne();

            let user = await User.findByIdAndUpdate(userID, { $pull: { follow: follow.to_user } });

            req.flash('success', 'Unfollowed.');
            return res.redirect('back');
        }
        else {
            req.flash('error', 'Could not be unfollowed.');
            return res.redirect('back');
        }
    } catch (err) {
        req.flash('error', 'Could not be unfollowed.');
        console.log('Error:', err);
        return res.redirect('back');
    }
}