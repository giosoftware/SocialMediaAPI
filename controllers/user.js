'use strict';

const User = require('../models/user');

function getUser(req, res) {
    if (req.user !== req.params.id)
        return res.status(403).json({
            message: 'No puedes acceder a los datos de otros usuarios'
        });
    User.findOne({ _id: req.params.id })
        .then(result => {
            if (!result)
                res.status(404).json({
                    message: 'No se han encontrado registros'
                });
            else res.json(result);
        })
        .catch(err => {
            res.status(500).json({ message: err.message });
        });
}

function deleteUser(req, res) {
    if (req.user !== req.params.id)
        return res
            .status(403)
            .json({ message: 'No puedes borrar el perfil de otros usuarios' });
    User.deleteOne({ _id: req.params.id })
        .then(result => {
            if (!result)
                res.status(404).json({
                    message: 'No se han encontrado registros'
                });
            else res.json(result);
        })
        .catch(err => {
            res.status(500).json({ message: err.message });
        });
}

function updateUser(req, res) {
    if (req.user !== req.params.id)
        return res.status(403).json({
            message: 'No puedes actualizar el perfil de otros usuarios'
        });
    try {
        const user = User.findOne({ _id: req.user });
        if (!user) {
            return res.status(404).json({
                message:
                    'No se ha encontrado el registro de usuario a modificar.'
            });
        }

        const newData = {
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

        const result = User.updateOne({ _id: req.params.id }, newData);
        if (!result) {
            return res.status(404).json({
                message: 'No se han encontrado registros'
            });
        }
        /**
         * Comprobar si hay que actualizar el nickname en las publicaciones,
         * comentarios y muros.
         */
        if (user.n !== newData.prof.n) {
            Post.updateMany({ n: user.n }, { $set: { n: newData.prof.n } });
            Comm.updateMany({ n: user.n }, { $set: { n: newData.prof.n } });
            Walls.updateMany({'p.n': "smartin"},{ $set: { 'p.$.n': "smartinr"} } );
        }

        res.json(result);
    } catch (err) {
        res.status(500).json({
            message: `Ha habido un error al actualizar el usuario: ${
                err.message
            }`
        });
    }
}

function addInterest(req, res) {
    const interest = req.body.interest;
    User.updateOne({ _id: req.user }, { $push: { i: interest } })
        .then(result => {
            if (!result)
                res.status(404).json({
                    message: 'No se han encontrado registros'
                });
            else res.json(result);
        })
        .catch(err => {
            res.status(500).json({ message: err.message });
        });
}

function blockUser(req, res) {
    const blockUser = req.body.blockUser;
    User.updateOne({ _id: req.user }, { $push: { b: blockUser } })
        .then(result => {
            if (!result)
                res.status(404).json({
                    message: 'No se han encontrado registros'
                });
            else res.json(result);
        })
        .catch(err => {
            res.status(500).json({ message: err.message });
        });
}

module.exports = { getUser, deleteUser, updateUser, addInterest, blockUser };
