'use strict';

const bcrypt = require('bcrypt');

const User = require('../models/user');
const service = require('../services/index');
const wall = require('../admin/wall');

/**
 * Registra un nuevo usuario en la red social. Se le generará un muro para 
 * el mes en curso y un jwt.
 */
async function register(req, res) {
    console.log(req.body);
    if (
        !req.body.firstName ||
        !req.body.lastName ||
        !req.body.email ||
        !req.body.password ||
        !req.body.nickname ||
        !req.body.interests
    ) {
        return res.status(422).json({
            message: 'Error creating the user: you must enter all required data'
        });
    }

    const user = new User({
        fn: req.body.firstName,
        ln: req.body.lastName,
        prof: {
            e: req.body.email,
            p: req.body.password,
            n: req.body.nickname
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
            message: `Error registering the new user: ${err.message}`
        });
    }
}

/**
 * Identifica a un usuario mediante su email y su password y le devuelve un jwt
 */
function login(req, res) {
    if (!req.body.email || !req.body.password) {
        return res.status(422).json({
            message:
                'Error identifying the user: you must include the email and password'
        });
    }

    User.findOne({ 'prof.e': req.body.email })
        .then(user => {
            if (!user)
                return res
                    .status(404)
                    .json({ message: "The user doesn't exists" });

            //console.log(user.password);
            // If match found, compare with stored password, using the bcrypt.compare function.
            bcrypt
                .compare(req.body.password, user.password)
                .then(result => {
                    if (result == true) {
                        res.json({
                            message: 'You have correctly identified',
                            token: service.createToken(user)
                        });
                    } else {
                        res.status(422).json({
                            message: 'You have not identified correctly'
                        });
                    }
                })
                .catch(err =>
                    res.status(500).json({
                        message: `Error trying to login: ${err.message}`
                    })
                );
        })
        .catch(err => {
            res.status(500).json({
                message: `Error trying to login: ${err.message}`
            });
        });
}

module.exports = { register, login };
