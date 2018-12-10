'use strict';

const express = require('express');

const config = require('./config/config');
const user = require('./routes/user');
const post = require('./routes/post');
const comm = require('./routes/comment')
const wall = require('./routes/wall')
let bodyParser = require('body-parser');

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

app.use('/users', user);
app.use('/posts', post);
app.use('/comms', comm);
app.use('/walls', wall);

app.listen(config.port, () => {
    console.log(`API REST corriendo en http://localhost:${config.port}`);
});
