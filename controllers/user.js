'use strict';

const User = require('../models/user');

function getUser(req, res) {
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
