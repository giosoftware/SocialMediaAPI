'use strict';

const express = require('express');
const router = express.Router();

const post = require("../controllers/post");

router.put("/addLike", post.addLike);
router.post('/', post.createPost);
router.get('/:id', post.getPost);
router.put("/:id", post.updatePost);
router.delete("/:id", post.deletePost);


module.exports = router

