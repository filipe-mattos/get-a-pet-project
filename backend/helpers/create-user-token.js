const jwt = require('jsonwebtoken');
require('dotenv').config();

const createUserToken = async (user, req, res) => {
  const token = jwt.sign({
    id: user.id,
    name: user.name,
  }, process.env.JWT_SECRET)

  res.status(200).json({message: 'Você esta autenticado', token: token, userId: user.id})
}

module.exports = createUserToken;