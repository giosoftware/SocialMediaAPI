'use strict';

const express = require('express');
const router = express.Router();

const user = require("../controllers/user");

router.post('/', user.create);

router.get('/:id', user.read);

router.put("/:id", user.update);

router.delete("/:id", user.del);

router.post('/:id', user.addInterest);

router.post('/:id', user.blockUser);

router.post('/register', user.register);

router.post('/login', user.login);

router.post('/deregister', user.register);

module.exports = router

