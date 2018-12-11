'user strict';

const express = require('express');

const postRouter = require('./post');
const commRouter = require('./comment');
const wallRouter = require('./wall');
const userRouter = require('./user');
const auth = require('../middlewares/auth');
const noauthUser = require('../controllers/noauthUser');

const api = express.Router();

api.use('/post/', auth, postRouter);
api.use('/comm/', auth, commRouter);
api.use('/wall/', auth, wallRouter);
api.use('/user/', auth, userRouter);
api.use('/register', noauthUser.register);
api.use('/login', noauthUser.login);

module.exports = api;
