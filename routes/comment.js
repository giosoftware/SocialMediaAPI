'use strict';

const express = require('express');
const router = express.Router();

const comm = require("../controllers/comment");

router.post('/', comm.create);

router.get('/:id', comm.read);

router.put("/:id", comm.update);

router.delete("/:id", comm.del);


module.exports = router

