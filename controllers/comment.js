'use strict';

const Comm = require('../models/comment');
const Wall = require('../models/wall');
const User = require('../models/user');

/**
 * Cuando un usuario añade un comentario hay que crearlo en su colección, además
 * de incorporarlo a la publicación a la que hace referencia en todos los muros
 * donde se encuentre. En el muro deben haber como máximo los 3 últimos commentarios.
 */
async function createComment(req, res) {
    try {
        let comm = {
            uid: req.user,
            n: req.body.nickname,
            t: req.body.text,
            pid: req.body.postId
        };
        // Crear el comentario en la colección
        comm = await Comm.create(comm);
        // recuperamos los últimos 3 comentarios del post
        const comms = await Comm.find({ pid: comm.pid })
            .limit(3)
            .sort({ d: -1 });
        // Añadirlo a su publicación correspondiente en los muros.
        await Wall.updateMany(
            {},
            { $set: { 'p.$[x].c': comms } },
            { arrayFilters: [{ 'x._id': comm.pid }] }
        );
        res.status(201).json(comm);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

function getComment(req, res) {
    Comm.findOne({ _id: req.params.id })
        .then(result => {
            if (result == null) res.send('No se han encontrado registros');
            else res.send(result);
        })
        .catch(err => {
            res.send(err);
        });
}

/**
 * Cuando un usuario elimina un comentario hay que confirmar que es suyo.
 * Después hay que borrarlo de su colección.
 * También hay que borrarlo de la publicación a la que hace referencia en todos
 * los muros donde se encuentre. Si era uno de los útimos 3 comentarios, hay que
 * recuperar el siguiente más actual de la colección de comentarios.
 */
async function deleteComment(req, res) {
    try {
        const commId = req.params.id;
        // Comprobamos que existe la publicación y que el usuario es el autor
        const comm = await Comm.findOne({ _id: commId });
        if (!comm) {
            throw new Error('El comentario indicado no existe');
        } else if (comm.uid != req.user) {
            throw new Error(
                'No puedes borrar los comentarios de otros usuarios'
            );
        }

        // recuperamos los últimos 3 comentarios del post
        const comms = await Comm.find({ pid: comm.pid })
            .limit(3)
            .sort({ d: -1 });

        // Borramos el comentario de la colección
        const result = await Comm.deleteOne({ _id: req.params.id });

        // Si era uno de los últimos 3, recargar los comentarios de los muros
        if (comms.find(comm => comm._id == commId) !== undefined) {
            const comms = await Comm.find({ pid: comm.pid })
                .limit(3)
                .sort({ d: -1 });
            await Wall.updateMany(
                {},
                { $set: { 'p.$[x].c': comms } },
                { arrayFilters: [{ 'x._id': comm.pid }] }
            );
        }

        res.json(result);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

function updateComment(req, res) {
    const comm = {
        uid: req.user,
        n: req.body.nickname,
        d: req.body.date,
        t: req.body.text,
        i: req.body.interests,
        l: req.body.likes,
        ln: req.body.likesNicknames
    };

    Comm.updateOne({ _id: req.params.id }, comm)
        .then(result => {
            if (result == null) res.send('No se han encontrado registros');
            else res.send(result);
        })
        .catch(err => {
            res.send(err);
        });
}

async function addLike(req, res) {
    try {
        const user = await User.findOne({ _id: req.user });
        if (!user)
            throw new Error(
                'No se ha encontrado el usuario que ha realizado la acción'
            );
        const comm = await Comm.updateOne(
            { _id: req.body.commId },
            { $inc: { l: 1 }, $push: { ln: user.prof.n } }
        );
        if (!comm) throw new Error('No se ha encontrado el comentario');
        else res.send(comm);
    } catch (err) {
        res.status(500).send({
            message: `Ha habido un error al añadir el 'Me gusta': ${
                err.message
            }`
        });
    }
}

module.exports = { createComment, getComment, deleteComment, updateComment, addLike };
