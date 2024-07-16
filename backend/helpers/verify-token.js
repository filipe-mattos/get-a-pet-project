const jwt = require("jsonwebtoken");
const getToken = require("./get-token");

//Middleware to validate token
const checkToken = (req, res, next) => {

  if (!req.headers.authorization) {
    res.status(401).json({message:"Acesso Negado"});
  }

 const token = getToken(req);

 if(!token){
   res.status(401).json({message:"Acesso Negado"});
 }

  try{
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next()
  }catch(err){
    res.status(400).json({message:"Token Invalido"});
  }

 return token
}

module.exports = checkToken