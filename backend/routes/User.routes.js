const router = require('express').Router();
const UserController = require('../controllers/UserController');

//Middlewares
const verifyToken = require('../helpers/verify-token');


router.post('/create', UserController.create);
router.post('/login', UserController.login);
router.get('/checkUser', UserController.checkUser);
router.get('/:id', UserController.getUserById);
router.patch('/update/:id', verifyToken, UserController.editUser);
module.exports = router;