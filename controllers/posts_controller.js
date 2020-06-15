module.exports.list = function (req, res) {
    return res.render('posts', {
        title: "Posts"
    });
};