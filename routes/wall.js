'use strict';

const express = require('express');
const router = express.Router();

const wall = require("../controllers/wall");

router.get('/', wall.read);

module.exports = router

