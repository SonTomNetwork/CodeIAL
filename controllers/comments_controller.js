const Comment = require('../models/comment');
const Post = require('../models/post');
const commentsMailer = require('../mailers/comments_mailer');
const commentEmailWorker = require('../workers/comment_email_worker');
const queue = require('../config/kue');

module.exports.create = async function (req, res) {
    try {
        post = await Post.findById(req.body.post);

        if (post) {
            let comment = await Comment.create({
                content: req.body.comment,
                post: req.body.post,
                user: req.user
            });
            post.comments.push(comment);
            post.save();

            comment = await comment.populate('user', 'name email').execPopulate();

            //commentsMailer.newComment(comment);
            let job = queue.create('emails', comment).save(function (err) {
                if (err) {
                    console.log('Error in sending to the queue:', err);
                    return;
                }
                console.log('Job enqueued', job.id);
            });

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