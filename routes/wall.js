'use strict';

const express = require('express');
const router = express.Router();

const wall = require("../controllers/wall");

router.post('/', wall.create);
router.get('/:id', wall.read);
router.put("/:id", wall.update);
router.delete("/:id", wall.del);

module.exports = router

