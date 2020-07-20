const Post = require('../models/post');
const Comment = require('../models/comment');

module.exports.create = async function (req, res) {
    try {
        await Post.create({
            content: req.body.content,
            user: req.user
        });

        req.flash('success', 'Post published.');
        return res.redirect('back');
    } catch (err) {
        req.flash('error', 'Post could not be published.');
        console.log('Error:', err);
        return;
    }

}

module.exports.destroy = async function (req, res) {
    try {
        let post = await Post.findById(req.params.id);

        if (post.user == req.user) {
            post.deleteOne();

            await Comment.deleteMany({ post: req.params.id });

            req.flash('success', 'Post deleted.');
            return res.redirect('back');
        }
        else {
            return res.redirect('back');
        }
    } catch (err) {
        req.flash('error', 'Post could not be deleted.');
        console.log('Error:', err);
        return;
    }
}