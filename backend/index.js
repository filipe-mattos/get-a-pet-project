const express = require('express');
const cors = require('cors');
const connection = require('./db/connection');
const app = express();

const User = require('./models/User');
const Pet = require('./models/Pet');


//Config Json Response
app.use(express.json());

//Solve CORS
app.use(cors({credentials: true, origin: 'http://localhost:3000'}))

//Public folder for images
app.use(express.static('public'));

//Routes
const UserRoutes = require('./routes/User.routes')
app.use('/users', UserRoutes);

connection.sync().then(() => app.listen(5000)).catch(err => console.log(err));
