const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require('mongoose');
const config = require('./config');
const cors = require('cors');

const app = express();
const router = express.Router();

//Connect ao banco
mongoose.connect(config.connectionString, { autoIndex: false });

//Carrega as Models
const Professional = require('./models/professional');
const User = require('./models/user');

//Carregar Rotas
const indexRoutes = require('./routes/index');
const professionalRoutes = require('./routes/professional');
const userRoutes = require('./routes/user');

app.use(cors({ origin: '*' }))

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use('/api/', indexRoutes);
app.use('/api/professionals', professionalRoutes);
app.use('/api/users', userRoutes);

module.exports = app;
