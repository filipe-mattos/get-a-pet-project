const User = require('../models/User');
const bcrypt = require("bcrypt");
const createUserToken = require("../helpers/create-user-token");
const getToken = require("../helpers/get-token");
const checkToken = require("../helpers/verify-token");
const jwt = require("jsonwebtoken");
require("dotenv").config();
module.exports = class UserController {
  static async create(req, res) {
    const {name, email, phone, password, confirmPassword} = req.body;

    // validation
    if(!name || !email || !phone || !password || !confirmPassword) {
      return res.status(422).json({message: 'Campos obrigatorios nao preenchidos'});
    }
    //Check password
    if(password !== confirmPassword) {
      return res.status(422).json({message: 'A senha e a confirmação de senha precisam ser iguais!'});
    }
    //Check if user already exist
    const userExists = await User.findOne({ raw: true, where: {email: email}})
    if(userExists) {
      return res.status(422).json({message: 'O email ja esta cadastrado'});
    }

    //Create Password
    const salt = await bcrypt.genSalt(12);
    const passwordHash = await bcrypt.hash(password, salt);

    //Create User
    const user = new User({name, email, phone, password: passwordHash})

    try {
      const newUser = await user.save();
      await createUserToken(newUser, req, res)
    }catch(err) {
      res.status(500).json({message: err})
    }
  }

  static async login(req, res) {
    const {email, password} = req.body;

    if(!email || !password) {
      return res.status(422).json({message: 'Campos obrigatorios nao preenchidos'});
    }

    //Check if user already exist
    const user = await User.findOne({ raw: true, where: {email: email}})
    if(!user) {
      return res.status(422).json({message: 'Email não cadastrado'});
    }

    //Check if password match with db password
    const checkPassword = await bcrypt.compare(password, user.password);
    if(!checkPassword) {
      return res.status(422).json({message: 'Senha Inválida'});
    }

    await createUserToken(user, req, res);
  }

  static async checkUser(req, res) {
    let currentUser

    if(req.headers.authorization) {
      const decoded = jwt.verify(getToken(req), process.env.JWT_SECRET);

      currentUser = await User.findOne({raw: true, where: {id: decoded.id}});
      currentUser.password = undefined;

      res.status(200).json(currentUser);
    }else {
      currentUser = null
    }

    res.status(200).send(currentUser);
  }

  static async getUserById(req, res){
    const {id} = req.params;
    const user = await User.findOne({raw: true, where: {id: id}});
    if(!user) {
      return res.status(422).json({message: "Usuário não encontrado"})
    }
    user.password = undefined;
    res.status(200).json({user});
  }

  static async editUser(req, res){
    res.status(200).json({message: 'Deu certo'})
  }
}