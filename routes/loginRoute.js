const express = require('express');
const {login, refreshToken, logout} = require('../controllers/loginControllers');

const router = express.Router();

// login
router.post('/login', login)

router.post('/refreshtoken', refreshToken)

router.delete('/logout', logout)

module.exports = router;