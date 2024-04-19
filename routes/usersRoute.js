const express = require('express');
const {saveUsers, getUserById} = require('../controllers/usersControllers');

const router = express.Router();

// adding users
router.post('/', saveUsers);

router.get('/:id', getUserById);


module.exports = router;