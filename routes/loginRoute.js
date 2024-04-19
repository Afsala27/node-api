const express = require('express');
const {login} = require('../controllers/loginControllers');

const router = express.Router();

// adding users
router.post('/', login)

module.exports = router;