'use strict';

const User = require('../models/user');

function read(req, res) {
    User.findOne({ _id: req.params.id })
        .then(result => {
            if (result == null) res.send('No se han encontrado registros');
            else res.send(result);
        })
        .catch(err => {
            res.send(err);
        });
}

function del(req, res) {
    User.deleteOne({ _id: req.params.id })
        .then(result => {
            if (result == null) res.send('No se han encontrado registros');
            else res.send(result);
        })
        .catch(err => {
            res.send(err);
        });
}

function update(req, res) {
    const user = {
        fn: req.body.firstName,
        ln: req.body.lastName,
        prof: {
            u: req.body.profile.nickname,
            ps: req.body.profile.password,
            e: req.body.profile.email
        },
        i: req.body.interests,
        b: req.body.blocked
    };

    User.updateOne({ _id: req.params.id }, user)
        .then(result => {
            if (result == null) res.send('No se han encontrado registros');
            else res.send(result);
        })
        .catch(err => {
            res.send(err);
        });
}

function addInterest(req, res) {
    const interest = req.body.interest;
    User.updateOne({ _id: req.user }, { $push: { i: interest } })
        .then(result => {
            if (result == null) res.send('No se han encontrado registros');
            else res.send(result);
        })
        .catch(err => {
            res.status(500).send({
                message: `Error al añadir el interés: ${err.message}`
            });
        });
}

function blockUser(req, res) {
    const blockUser = req.body.blockUser;
    User.updateOne({ _id: req.user }, { $push: { b: blockUser } })
        .then(result => {
            if (result == null) res.send('No se han encontrado registros');
            else res.send(result);
        })
        .catch(err => {
            res.status(500).send({
                message: `Error al bloquear al usuario interés: ${err.message}`
            });
        });
}

module.exports = { read, del, update, addInterest, blockUser };
