'use strict';

const User = require('../models/user');

function getUser(req, res) {
    if (req.user !== req.params.id) return res.status(403).json({ message: 'No puedes acceder a los datos de otros usuarios' });
    User.findOne({ _id: req.params.id })
        .then(result => {
            if (!result) res.status(404).json({message: 'No se han encontrado registros'});
            else res.json(result);
        })
        .catch(err => {
            res.status(500).json({message: err.message});
        });
}

function deleteUser(req, res) {
    if (req.user !== req.params.id) return res.status(403).json({ message: 'No puedes borrar el perfil de otros usuarios' });
    User.deleteOne({ _id: req.params.id })
        .then(result => {
            if (!result) res.status(404).json({message: 'No se han encontrado registros'});
            else res.json(result);
        })
        .catch(err => {
            res.status(500).json({message: err.message});
        });
}

function updateUser(req, res) {
    if (req.user !== req.params.id) return res.status(403).json({ message: 'No puedes actualizar el perfil de otros usuarios' });
    const user = {
        fn: req.body.firstName,
        ln: req.body.lastName,
        prof: {
            n: req.body.profile.nickname,
            p: req.body.profile.password,
            e: req.body.profile.email
        },
        i: req.body.interests,
        b: req.body.blocked
    };

    User.updateOne({ _id: req.params.id }, user)
        .then(result => {
            if (!result) res.status(404).json({message: 'No se han encontrado registros'});
            else res.json(result);
        })
        .catch(err => {
            res.status(500).json({message: err.message});
        });
}

function addInterest(req, res) {
    const interest = req.body.interest;
    User.updateOne({ _id: req.user }, { $push: { i: interest } })
        .then(result => {
            if (!result) res.status(404).json({message: 'No se han encontrado registros'});
            else res.json(result);
        })
        .catch(err => {
            res.status(500).json({message: err.message});
        });
}

function blockUser(req, res) {
    const blockUser = req.body.blockUser;
    User.updateOne({ _id: req.user }, { $push: { b: blockUser } })
        .then(result => {
            if (!result) res.status(404).json({message: 'No se han encontrado registros'});
            else res.json(result);
        })
        .catch(err => {
            res.status(500).json({message: err.message});
        });
}

module.exports = { getUser, deleteUser, updateUser, addInterest, blockUser };
