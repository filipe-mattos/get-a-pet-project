const User = require('../models/User');

module.exports = class UserController {
  static async create(req, res) {
    const user = {
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
      password: req.body.password,
      confirmPassword: req.body.confirmPassword,
    }

    // validation
    if(!user.name || !user.email || !user.phone || !user.password || !user.confirmPassword) {
      return res.status(422).json({message: 'Campos obrigatorios nao preenchidos'});
    }
    //Check password
    if(user.password !== user.confirmPassword) {
      return res.status(422).json({message: 'A senha e a confirmação de senha precisam ser iguais!'});
    }
    //Check if user already exist
    const userExists = await User.findOne({ raw: true, where: {email: user.email}})
    if(userExists) {
      return res.status(422).json({message: 'O email ja esta cadastrado'});
    }

    res.status(201).json({message: 'User registered'});
  }
}