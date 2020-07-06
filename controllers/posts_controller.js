const Post = require('../models/post');
const Comment = require('../models/comment');

module.exports.create = function (req, res) {
    Post.create({
        content: req.body.content,
        user: req.user
    }, function (err, post) {
        if (err) {
            console.log('Error in creating post');
            return;
        }

        return res.redirect('back');
    });
}

module.exports.destroy = function (req, res) {
    Post.findById(req.params.id, function (err, post) {
        if (post.user == req.user) {
            post.deleteOne();
            Comment.deleteMany({ post: req.params.id }, function (err) {
                if (err) {
                    console.log('Controller error - comments');
                }
                return res.redirect('back');
            });
        }
        else {
            return res.redirect('back');
        }
    });
}