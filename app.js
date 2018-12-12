'use strict';

const express = require('express');
const bodyParser = require('body-parser');

const config = require('./config/config');
const globalRoutes = require('./routes/global');

const app = express();
const mongoose = require('mongoose');
mongoose.set('useCreateIndex', true); // To avoid DeprecationWarning
mongoose.connect(config.db, { useNewUrlParser: true }, (err, res) => {
    if (err) {
        return console.log(`Error al conectar la bd: ${err}`);
    }
    console.log('Conexion establecida');
});
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/api/', globalRoutes);

app.listen(config.port, () => {
    console.log(`API REST corriendo en http://localhost:${config.port}`);
});
