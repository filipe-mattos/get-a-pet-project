const {Sequelize} = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USERNAME,
  process.env.DB_PASSWORD,
  {
    host: 'localhost',
    dialect: 'postgres'
  }
);

sequelize.authenticate()
  .then(() => console.log("Conectado com sucesso"))
  .catch((error) => {console.log("Erro ao conectar ao banco: ", error)});

module.exports = sequelize;

