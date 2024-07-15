const express = require('express');
const cors = require('cors');
const connection = require('./db/connection');
const app = express();

//Config Json Response
app.use(express.json());

//Solve CORS
app.use(cors({credentials: true, origin: 'http://localhost:3000'}))

//Public folder for images
app.use(express.static('public'));

//Routes

app.listen(5000);