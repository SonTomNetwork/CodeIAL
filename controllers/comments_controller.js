const Comment = require('../models/comment');
const Post = require('../models/post');

module.exports.create = async function (req, res) {
    try {
        await Post.findById(req.body.post);

        if (post) {
            let comment = await Comment.create({
                content: req.body.comment,
                post: req.body.post,
                user: req.user
            });

            post.comments.push(comment);
            post.save();

            res.redirect('/');
        }
    } catch (err) {
        console.log('Error:', err);
        return;
    }
}

module.exports.destroy = async function (req, res) {
    try {
        let comment = await Comment.findById(req.params.id);

        if (comment.user == req.user) {
            let postID = comment.post;
            comment.deleteOne();

            let post = await Post.findByIdAndUpdate(postID, { $pull: { comments: req.params.id } });

            return res.redirect('back');
        }
        else {
            return res.redirect('back');
        }
    } catch (error) {
        console.log('Error:', err);
        return;
    }
}