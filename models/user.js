'use strict';

const bcrypt = require('bcrypt');
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
        e: {
            type: String,
            lowercase: true,
            required: [true, 'el campo correo electrónico es obligatorio'],
            alias: 'email',
            match: [
                /\S+@\S+\.\S+/,
                'Por favor, introduce un correo electrónico válido'
            ]
        },
        p: {
            type: String,
            required: [true, 'el campo contraseña es obligatorio'],
            alias: 'password'
        },
        n: {
            type: String,
            lowercase: true,
            required: [true, 'el campo apodo es obligatorio'],
            alias: 'nickname'
        },
    },
    i: {
        type: [String],
        required: [true, 'el campo intereses es obligatorio'],
        alias: 'interests'
    },
    b: {
        type: [Schema.Types.ObjectId],
        alias: 'blocked'
    }
});

userSchema.pre('save', function (next) {
    const user = this;

    bcrypt.genSalt(10)
        .then((salt) => {
            bcrypt.hash(user.password, salt)
                .then((hash) => {
                    user.password = hash;
                    next();
                })
        })
        .catch((err) => {
            return next(err);
        })

})

userSchema
    .virtual('fullName')
    .get(function () {
        return this.first_name + ' ' + this.last_name;
    })
    .set(function (name) {
        this.first_name = name.substr(0, name.indexOf(' '));
        this.last_name = name.substr(name.indexOf(' ') + 1);
    });

const User = mongoose.model('user', userSchema);

module.exports = User;
