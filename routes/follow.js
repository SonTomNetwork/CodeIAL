const express = require('express');
const router = express.Router();
const passport = require('passport');

const followController = require('../controllers/follow_controller');

router.post('/add', passport.checkAuthentication, followController.create);
router.get('/remove/:id', passport.checkAuthentication, followController.destroy);

module.exports = router;