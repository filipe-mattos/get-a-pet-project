const router = require("express").Router();
const petController = require("../controllers/petController");

//Middlewares
const verifyToken = require("../helpers/verify-token");
const {imageUploader} = require("../helpers/image-uploader");

router.post('/create', verifyToken, imageUploader.array('images'), petController.create);
router.get('/getAll', petController.getAll);
router.get('/myPets', verifyToken, petController.getAllUserPets);
router.get('/myAdoptions', verifyToken, petController.getAllUserAdoptions);
router.get('/:id', petController.getPetById);
router.delete('/:id', verifyToken, petController.deletePetById);
router.patch('/update/:id', verifyToken, imageUploader.array('images'), petController.editPet)
module.exports = router;