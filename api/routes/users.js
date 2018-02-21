const express = require('express');
const UserController = require('../controllers/users');
const checkAuth = require('../middleware/check-auth');
const router = express.Router();

router.post('/signup', UserController.user_signup);

router.post('/login', UserController.user_login);

router.delete('/:userId', checkAuth, UserController.user_delete)

module.exports = router;
