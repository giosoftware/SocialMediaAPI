'use strict';

const express = require('express');
const router = express.Router({ mergeParams: true } );

const user = require('../controllers/user');

//router.post('/', user.create); No tiene sentido que un usuario pueda crear otro
router.put('/addInterest', user.addInterest);
router.put('/blockUser', user.blockUser);
router.get('/:id', user.read);
router.put('/:id', user.update);
router.delete('/:id', user.del);


module.exports = router;
