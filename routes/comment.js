'use strict';

const express = require('express');
const router = express.Router();

const comm = require('../controllers/comment');

router.put('/addLike', comm.addLike);
router.post('/', comm.createComment);
router.get('/:id', comm.readComment);
router.put('/:id', comm.updateComment);
router.delete('/:id', comm.deleteComment);

module.exports = router;
