const router = require("express").Router();
const petController = require("../controllers/petController");

//Middlewares
const verifyToken = require("../helpers/verify-token");

router.post('/create', verifyToken, petController.create);

module.exports = router;