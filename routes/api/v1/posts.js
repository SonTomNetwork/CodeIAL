const express = require('express');
const router = express.Router();
const passport = require('passport');

const postsAPI = require('../../../controllers/api/v1/posts_api');
const { session } = require('passport');

router.get('/', postsAPI.index);
router.delete('/:id', passport.authenticate('jwt', { session: false }), postsAPI.destroy);

module.exports = router;