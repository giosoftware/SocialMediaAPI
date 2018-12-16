'use strict';

const express = require('express');
const router = express.Router({ mergeParams: true } );

const user = require('../controllers/user');

//router.post('/', user.create); No tiene sentido que un usuario pueda crear otro
router.put('/addInterest', user.addInterest);
router.put('/blockUser', user.blockUser);
router.get('/:id', user.getUser);
router.put('/:id', user.updateUser);
router.delete('/:id', user.deleteUser);


module.exports = router;
