'use strict';

const bcrypt = require('bcrypt');

const User = require('../models/user');
const service = require('../services/index');
const wall = require('../admin/wall');

/**
 * Cuando un nuevo usuario se registra en la red social, hay que añadir el usuario
 * a la colección users. Además hay que generarle un muro para el mes en curso
 */
async function register(req, res) {
    if (
        !req.body.firstName ||
        !req.body.lastName ||
        !req.body.profile.email ||
        !req.body.profile.password ||
        !req.body.profile.nickname ||
        !req.body.interests
    ) {
        return res.status(422).json({
            message: 'Error al crear el usuario: debes incluir todos los datos'
        });
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
    });

    try {
        // añadir el usuario a la colección users
        await user.save();
        // Generar el muro para el mes en curso
        await wall.generateCurrentMonthWall(user);
        return res.status(201).json({ token: service.createToken(user) });
    } catch (err) {
        res.status(500).json({
            message: `Error al registrar el nuevo usuario: ${err.message}`
        });
    }
}

// Login
function login(req, res) {
    if (!req.body.email || !req.body.password) {
        return res.status(422).json({
            message:
                'Error al identificar el usuario: debes incluir el email y el password'
        });
    }

    User.findOne({ 'prof.e': req.body.email })
        .then(user => {
            if (!user)
                return res
                    .status(404)
                    .json({ message: 'No se han encontrado registros' });

            //console.log(user.password);
            // If match found, compare with stored password, using the bcrypt.compare function.
            bcrypt
                .compare(req.body.password, user.password)
                .then(result => {
                    if (result == true) {
                        res.json({
                            message: 'Te has identificado correctamente',
                            token: service.createToken(user)
                        });
                    } else {
                        res.status(422).json({
                            message: 'No te has identificado correctamente'
                        });
                    }
                })
                .catch(err =>
                    res.status(500).json({
                        message: `Error al identificarse: ${err.message}`
                    })
                );
        })
        .catch(err => {
            res.status(500).json({
                message: `Error al identificarse: ${err.message}`
            });
        });
}

module.exports = { register, login };
