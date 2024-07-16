const Pet = require('../models/Pet');
const getUserByToken = require("../helpers/get-user-by-token");
const getToken = require("../helpers/get-token");

module.exports = class PetController {
  //Create a pet
  static async create(req, res) {
    const {name, age, weight, color} = req.body;
    const images = req.files
    const available = true;

    //validations
    if (!name || !age || !weight || !color || !images) {
      return res.status(422).json({message: 'Campos obrigatorios nao preenchidos'});
    }

    if(images.length === 0) {
      return res.status(422).json({message: 'A imagem do pet é obrigatoria'});
    }
    // get pet owner
    const user = await getUserByToken(getToken(req), req)

    const pet = new Pet({
      name,
      age,
      weight,
      color,
      available,
      images: [],
      UserId: user.id,
    });

    //images upload
    images.map((image) => {
      pet.images.push(image.filename);
    })

    try {
      await pet.save();
      res.status(201).json({message: 'Pet criado com sucesso!'});
    } catch (err){
      res.status(500).json({message: err});
    }
  }

  static async getAll(req, res){

    try {
      const pets = await Pet.findAll({order: [['createdAt', 'DESC']]});
      res.status(200).json({pets})
    }catch (err){
      res.status(500).json({message: err});
    }
  }

  static async getAllUserPets(req, res){

    const user = await getUserByToken(getToken(req), req);
    try {
      const pets = await Pet.findAll({where: {UserId: user.id},order: [['createdAt', 'DESC']]});
      res.status(200).json({pets})
    }catch (err){
      res.status(500).json({message: err});
    }
  }

  static async getAllUserAdoptions(req, res){

    const user = await getUserByToken(getToken(req), req);
    try {
      const pets = await Pet.findAll({where: {adopter_id: user.id},order: [['createdAt', 'DESC']]});
      res.status(200).json({pets})
    }catch (err){
      res.status(500).json({message: err});
    }
  }

  static async getPetById(req, res){
    const id = req.params.id
    if(!id){
      return res.status(500).json({message: "Id Invalido"})
    }
    try{
      const pet = await Pet.findOne({where: {id: id}})
      if(!pet){
        return res.status(404).json({message: "Não foi possivel localizar um pet com esse id"})
      }
      res.status(200).json({pet})
    }catch{
      res.status(500).json({message: "Id Invalido"})
    }

  }


}