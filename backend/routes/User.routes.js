const router = require('express').Router();
const UserController = require('../controllers/UserController');

router.post('/create', UserController.create);
router.post('/login', UserController.login);
router.get('/checkUser', UserController.checkUser);
router.get('/:id', UserController.getUserById);
module.exports = router;