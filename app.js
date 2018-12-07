'use strict';

const express = require('express');
const user = require('./routes/user');
const post = require('./routes/post');
const comm = require('./routes/comment')
const wall = require('./routes/wall')
let bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/users', user);
app.use('/posts', post);
app.use('/comms', comm);
app.use('/walls', wall);

app.listen(3000);
