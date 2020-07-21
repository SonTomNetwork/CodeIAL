const User = require('../../../models/users');
const jwt = require('jsonwebtoken');

module.exports.createSession = async function (req, res) {
    try {
        let user = await User.findOne({ email: req.body.email });

        if (!user || user.password != req.body.password) {
            return res.status(422).json({
                message: 'Invalid username or password.'
            });
        }
        return res.status(200).json({
            message: 'Sign in successful.',
            data: {
                token: jwt.sign(user.toJSON(), 'codeial', { expiresIn: '100000' })
            }
        });
    } catch (error) {
        console.log('Error:', error);
        return res.status(500).json({
            message: 'Internal server error.'
        });
    }
};