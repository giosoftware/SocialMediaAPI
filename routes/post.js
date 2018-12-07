'use strict';

const express = require('express');
const router = express.Router();

const post = require("../controllers/post");

router.post('/', post.create);

router.get('/:id', post.read);

router.put("/:id", post.update);

router.delete("/:id", post.del);


module.exports = router

