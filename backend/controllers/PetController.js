const Pet = require('../models/Pet');
const User = require('../models/User');
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

  static async deletePetById(req, res){
    const id = req.params.id;
    const pet = await Pet.findOne({where: {id: id}})
    if(!pet){
      return res.status(404).json({message: "Não foi possivel localizar um pet com esse id"})
    }

    //Check if logged in user registered the pet
    const user = await getUserByToken(getToken(req), req)
    if(pet.UserId !== user.id){
      return res.status(422).json({message: "Ocorreu um erro ao processar a sua solicitação, Tente Novamente mais tarde!"})
    }

    await Pet.destroy({where: {id: id}})
      .then(() => res.status(200).json({message: "Pet Deletado Com Sucesso!"}))
      .catch((err) => res.status(500).json({message: err}));
  }

  static async editPet(req, res){
    const id = req.params.id;
    const {name, age, weight, color} = req.body;
    console.log(req.body)
    const images = req.files;

    let updatedData = {}

    //Check if pet exist
    const pet = await Pet.findOne({where: {id: id}})
    if(!pet){
      return res.status(404).json({message: "Não foi possivel localizar um pet com esse id"})
    }

    //Check if logged in user registered the pet
    const user = await getUserByToken(getToken(req), req)
    if(pet.UserId !== user.id){
      return res.status(422).json({message: "Ocorreu um erro ao processar a sua solicitação, Tente Novamente mais tarde!"})
    }
    console.log(name, age, weight, color)
    //validations
    if (!name || !age || !weight || !color || !images) {
      return res.status(422).json({message: 'Campos obrigatorios nao preenchidos'});
    }
    updatedData = {name, age, weight, color};

    if(images.length === 0) {
      return res.status(422).json({message: 'A imagem do pet é obrigatoria'});
    }else{
      updatedData.images = [];
      images.map((image) => {
        updatedData.images.push(image.filename);
      })
    }

    await Pet.update(updatedData, {where: {id: id}})
      .then(() => res.status(200).json({message: "Pet Alterado com Sucesso"}))
      .catch(err => res.status(500).json({message: err}));

  }

  static async schedule(req, res){
    const id = req.params.id;

    //Check if pet exist
    const pet = await Pet.findOne({raw: true, where: {id: id}})
    if(!pet){
      return res.status(404).json({message: "Não foi possivel localizar um pet com esse id"})
    }

    //Check if user registered the pet
    const user = await getUserByToken(getToken(req), req)
    if(pet.UserId === user.id){
      return res.status(422).json({message: "Não é possivel agendar uma visita com seu propio pet"})
    }

    //Check if user has already scheduled a visit
    if(pet.adopter_id === user.id){
      return res.status(422).json({message: "Você ja agendou uma visita para este pet"})
    }

    //Add user to pet
    pet.adopter_id = user.id;
    console.log(pet)

    try {
      await Pet.update(pet, {where: {id: id}});
      const petOwner = await User.findOne({raw: true, where: {id: pet.UserId}});
      return res.status(200).json({message: `A visita foi agendada com sucesso, entre em contato com ${petOwner.name} pelo telefone ${petOwner.phone}`});
    }catch(err){
      return res.status(500).json({message: err})
    }

  }

  static async concludeAdoption(req, res){
    const id = req.params.id;

    //Check if pet exist
    const pet = await Pet.findOne({raw: true, where: {id: id}})
    if(!pet){
      return res.status(404).json({message: "Não foi possivel localizar um pet com esse id"})
    }

    //Check if user registered the pet
    const user = await getUserByToken(getToken(req), req)
    if(pet.UserId === user.id){
      return res.status(422).json({message: "Não é possivel concluir uma adoção com seu propio pet"})
    }

    pet.available = false;
    await Pet.update(pet, {where: {id: id}})
      .then(() => {return res.status(200).json({message: `Parabens! A adoção foi concluida com sucesso!!`});})
      .catch(err => res.status(500).json({message: err}));

  }
}