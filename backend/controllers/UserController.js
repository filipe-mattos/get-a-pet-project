const User = require('../models/User');
const bcrypt = require("bcrypt");
const createUserToken = require("../helpers/create-user-token");

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
    };
  }
}