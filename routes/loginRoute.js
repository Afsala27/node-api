const express = require('express');
const {login, refreshToken} = require('../controllers/loginControllers');

const router = express.Router();

// login
router.post('/login', login)

router.post('/refreshtoken', refreshToken)

module.exports = router;