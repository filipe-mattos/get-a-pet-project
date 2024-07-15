const User = require('../models/User');

module.exports = class UserController {
  static async create(req, res) {
    res.status(201).json({message: 'User registered'});
  }
}