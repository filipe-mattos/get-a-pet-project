const router = require('express').Router();
const UserController = require('../controllers/UserController');

router.post('/create', UserController.create);

module.exports = router;