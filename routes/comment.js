'use strict';

const express = require('express');
const router = express.Router();

const comm = require('../controllers/comment');

router.put('/addLike', comm.addLike);
router.put('/removeLike', comm.removeLike);
router.post('/', comm.createComment);
router.get('/:id', comm.getComment);
router.put('/:id', comm.updateComment);
router.delete('/:id', comm.deleteComment);

module.exports = router;
