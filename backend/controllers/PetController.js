const Pet = require('../models/Pet');
const getUserByToken = require("../helpers/get-user-by-token");
const getToken = require("../helpers/get-token");

module.exports = class PetController {
  //Create a pet
  static async create(req, res) {
    const {name, age, weight, color} = req.body;
    const available = true;

    //images upload

    //validations
    if (!name || !age || !weight || !color) {
      return res.status(422).json({message: 'Campos obrigatorios nao preenchidos'});
    }
    // get pet owner
    const user = await getUserByToken(getToken(req), req)
    console.log(user)

    const pet = new Pet({
      name,
      age,
      weight,
      color,
      available,
      images: [],
      UserId: user.id,
    });
    try {
      await pet.save();
      res.status(201).json({message: 'Pet criado com sucesso!'});
    } catch (err){
      res.status(500).json({message: err});
    }
  }
}