'use strict';

const User = require('../models/user');

const read = (req, res) => {
    User.findOne({ _id: req.params.id })
        .then(result => {
            if (result == null) res.send('No se han encontrado registros');
            else res.send(result);
        })
        .catch(err => {
            res.send(err);
        });
};

const del = (req, res) => {
    User.deleteOne({ _id: req.params.id })
        .then(result => {
            if (result == null) res.send('No se han encontrado registros');
            else res.send(result);
        })
        .catch(err => {
            res.send(err);
        });
};

const update = (req, res) => {
    const user = {
        fn: req.body.firstName,
        ln: req.body.lastName,
        prof: {
            u: req.body.profile.username,
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
};

const addInterest = (req, res) => {
    const interest = req.body.interest;
    User.updateOne({ _id: req.user }, { $push: { i: interest } })
        .then(result => {
            if (result == null) res.send('No se han encontrado registros');
            else res.send(result);
        })
        .catch(err => {
            res.status(500).send({ message: `Error al añadir el interés: ${err.message}` });
        });
}

const blockUser = (req, res) => {
    const blockUser = req.body.blockUser;
    User.updateOne({ _id: req.user }, { $push: { b: blockUser } })
        .then(result => {
            if (result == null) res.send('No se han encontrado registros');
            else res.send(result);
        })
        .catch(err => {
            res.status(500).send({ message: `Error al bloquear al usuario interés: ${err.message}` });
        });
}

module.exports = { read, del, update, addInterest, blockUser };
