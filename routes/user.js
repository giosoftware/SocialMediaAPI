'use strict';

const express = require('express');
const router = express.Router();

const user = require("../controllers/user");

router.post('/', user.create);

router.get('/:id', user.read);

router.put("/:id", user.update);

router.delete("/:id", user.del);


module.exports = router

