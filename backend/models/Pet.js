const {DataTypes} = require('sequelize');
const db = require('../db/connection');
const User = require('../models/user');

const Pet = db.define('Pet', {
  name: {
    type: DataTypes.STRING,
    required: true,
  },
  age: {
    type: DataTypes.INTEGER,
    required: true,
  },
  weight: {
    type: DataTypes.INTEGER,
    required: true,
  },
  color: {
    type: DataTypes.STRING,
    required: true,
  },
  images: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    required: true,
  },
  available: {
    type: DataTypes.BOOLEAN,
  },
})

User.hasMany(Pet)
Pet.belongsTo(User)

module.exports = Pet;