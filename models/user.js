'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    fn: {
        type: String,
        required: [true, 'el campo nombre es obligatorio'],
        alias: 'firstname'
    },
    ln: {
        type: String,
        required: [true, 'el campo apellidos es obligatorio'],
        alias: 'lastname'
    },
    prof: {
        u: {
            type: String,
            lowercase: true,
            unique: true,
            required: [true, 'el campo nombre de usuario es obligatorio'],
            alias: 'username'
        },
        ps: {
            type: String,
            required: [true, 'el campo contraseña es obligatorio'],
            alias: 'password'
        },
        e: {
            type: String,
            lowercase: true,
            unique: true,
            required: [true, 'el campo correo electrónico es obligatorio'],
            alias: 'email',
            match: [
                /\S+@\S+\.\S+/,
                'Por favor, introduce un correo electrónico válido'
            ]
        },
    },
    i: {
        type: [String],
        required: [true, 'el campo círculos es obligatorio'],
        alias: 'interests'
    },
    b: {
        type: [Schema.Types.ObjectId],
        alias: 'blocked'
    }
});

userSchema
    .virtual('fullName')
    .get(function() {
        return this.first_name + ' ' + this.last_name;
    })
    .set(function(name) {
        this.first_name = name.substr(0, name.indexOf(' '));
        this.last_name = name.substr(name.indexOf(' ') + 1);
    });

const User = mongoose.model('user', userSchema);

module.exports = User;
