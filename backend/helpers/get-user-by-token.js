const jwt = require("jsonwebtoken");
const User = require("../models/user");
require("dotenv").config();

const getUserByToken = async (token, res) => {
  if(!token){
    res.status(401).json({message:"Acesso Negado"});
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  const userId = decoded.id;
  
  return await User.findOne({raw:true, where: {id: userId} });
}

module.exports = getUserByToken;