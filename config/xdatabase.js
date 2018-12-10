'use strict';

const mongoose = require('mongoose')
mongoose.set('useCreateIndex', true); // To avoid DeprecationWarning

const connectionDB = mongoose.connect('mongodb://localhost/SocialNetwork', {useNewUrlParser: true} )
    .then(()=>console.log('connection established'))
    .catch(console.error.bind(console, 'error: '))

exports=connectionDB
