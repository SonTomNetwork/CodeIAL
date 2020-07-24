const nodemailer = require('../config/nodemailer');

//Another way of exporting functions
exports.newComment = (comment) => {
    let htmlString = nodemailer.renderTemplate({ comment: comment }, '/comments/new_comment.ejs')

    nodemailer.transporter.sendMail({
        from: 'tomriddlessgss@gmail.com',
        to: comment.user.email,
        subject: 'New Comment Published!',
        html: htmlString
    }, (err, info) => {
        if (err) {
            console.log('Error in sending mail:', err);
            return;
        }
        //console.log('Message sent:', info);
        return;
    })
}