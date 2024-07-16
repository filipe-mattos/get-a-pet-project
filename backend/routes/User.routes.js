const router = require('express').Router();
const UserController = require('../controllers/UserController');

//Middlewares
const verifyToken = require('../helpers/verify-token');
const {imageUploader} = require('../helpers/image-uploader');

router.post('/create', UserController.create);
router.post('/login', UserController.login);
router.get('/checkUser', UserController.checkUser);
router.get('/:id', UserController.getUserById);
router.patch('/update/:id', verifyToken, imageUploader.single("image"), UserController.editUser);

module.exports = router;