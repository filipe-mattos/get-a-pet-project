const router = require("express").Router();
const petController = require("../controllers/petController");

//Middlewares
const verifyToken = require("../helpers/verify-token");
const {imageUploader} = require("../helpers/image-uploader");

router.post('/create', verifyToken, imageUploader.array('images'), petController.create);
router.get('/getAll', petController.getAll);
router.get('/myPets', verifyToken, petController.getAllUserPets);
module.exports = router;