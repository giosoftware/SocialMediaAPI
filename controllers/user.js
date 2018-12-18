'use strict';

const mongoose = require('mongoose');

const User = require('../models/user');
const Comm = require('../models/comment');
const Wall = require('../models/wall');
const Post = require('../models/post');

/**
 * Devuelve el documento del usuario especificado en el parámetro
 */
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

/**
 * Elimina el documento del usuario especificado en el parámetro
 */
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

/**
 * Actualiza el documento del usuario especificado en el parámetro. Si el nickname
 * ha sido uno de los datos cambiados, se actuliza en las publicaciones, comentarios,
 * tanto en sus colecciones como en los muros donde se encuentren.
 */
async function updateUser(req, res) {
    if (req.user !== req.params.id) {
        return res.status(403).json({
            message: 'No puedes actualizar el perfil de otros usuarios'
        });
    }
    try {
        const user = await User.findOne({ _id: req.user });
        if (!user) {
            return res.status(404).json({
                message:
                    'No se ha encontrado el registro de usuario a modificar.'
            });
        }
        const oldNickname = user.prof.n;
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

        const result = await User.updateOne({ _id: req.params.id }, newData);
        if (!result) {
            return res.status(404).json({
                message: 'No se han encontrado registros'
            });
        }
        /**
         * Comprobar si hay que actualizar el nickname en las publicaciones,
         * comentarios y muros.
         */
        if (oldNickname !== newData.prof.n) {
            console.log('el nick ha cambiado');
            console.log('Old newName: ' + oldNickname + ', New nickname: ' + newData.prof.n);
            const p = await Post.updateMany({ uid: req.user }, { n: newData.prof.n });
            const c = await Comm.updateMany({ uid: req.user }, { n: newData.prof.n });
            const w1 = await Wall.updateOne({ uid: req.user }, { n: newData.prof.n });
            const w2 = await Wall.updateMany({ "p.uid": mongoose.Types.ObjectId(req.user) }, { $set: { "p.$.n": newData.prof.n } });
            const w3 = await Wall.updateMany({ "p.c.uid": mongoose.Types.ObjectId(req.user) }, { $set: { "p.$.c.$[].n": newData.prof.n } });
            console.log(p); console.log(c); console.log(w1); console.log(w2); console.log(w3);
        }

        res.json(result);
    } catch (err) {
        res.status(500).json({
            message: `Ha habido un error al actualizar el usuario: ${err.message}`
        });
    }
}

/**
 * Añade un area de interés (tag) al usuario
 */
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

/**
 * Elimina un area de interés (tag) del usuario
 */
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
