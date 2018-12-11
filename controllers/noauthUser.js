'use strict';

const User = require('../models/user');
const service = require('../services/index');
const bcrypt = require('bcrypt');

// Registro
const register = (req, res) => {
    if (!req.body.firstName || !req.body.lastName || !req.body.profile.email ||
        !req.body.profile.password || !req.body.profile.nickname || !req.body.interests) {
        return res
            .status(422)
            .send({ message: `Error al crear el usuario: debes incluir todos los datos` });
    }

    const user = new User({
        fn: req.body.firstName,
        ln: req.body.lastName,
        prof: {
            e: req.body.profile.email,
            p: req.body.profile.password,
            n: req.body.profile.nickname
        },
        i: req.body.interests
        // b: req.body.blocked,
    });

    user.save(err => {
        if (err)
            return res
                .status(500)
                .send({ message: `Error al crear el usuario: ${err.message}` });

        return res.status(201).send({ token: service.createToken(user) });
    });
};

// Login
const login = (req, res) => {
    if (!req.body.email || !req.body.password) {
        return res
            .status(422)
            .send({ message: `Error al crear identificar el usuario: debes incluir el email y el password` });
    }

    User.findOne({ 'prof.e': req.body.email })
        .then(user => {
            if (!user)
                return res.status(404).send({ message: 'No se han encontrado registros' });

            //console.log(user.password);
            // If match found, compare with stored password, using the bcrypt.compare function.
            bcrypt
                .compare(req.body.password, user.password)
                .then(result => {
                    if (result == true) {
                        res.status(200).send({
                            message: 'Te has identificado correctamente',
                            token: service.createToken(user)
                        });
                    } else {
                        res.status(422).send({
                            message: 'No te has identificado correctamente',
                        });
                    }
                })
                .catch(err => res.status(500).send({ message: `Error al identificarse: ${err.message}` }));
        })
        .catch(err => {
            res.status(500).send({ message: `Error al identificarse: ${err.message}` });
        });
};

module.exports = { register, login };