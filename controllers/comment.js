'use strict';

const mongoose = require('mongoose');

const Comm = require('../models/comment');
const Wall = require('../models/wall');
const User = require('../models/user');

/**
 * Añade un comentario a su colección, además de incorporarlo a la publicación a 
 * la que hace referencia en todos los muros donde se encuentre. En el muro deben 
 * estar como máximo los 3 últimos commentarios.
 */
async function createComment(req, res) {
    try {
        // Cargamos los datos del usuario
        const user = await User.findOne({ _id: req.user });
        if (!user)
            throw new Error(
                'No se ha encontrado el usuario que ha realizado la acción'
            );
        let comm = {
            uid: req.user,
            n: user.prof.n,
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

/**
 * Devuelve el documento del comentario especificado en el parámetro.
 */
function getComment(req, res) {
    Comm.findOne({ _id: req.params.id })
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
 * Elimina el comentario especificado en el parámetro
 * También lo borra de la publicación a la que hace referencia en todos
 * los muros donde se encuentra. Si era uno de los útimos 3 comentarios, se
 * recupera el siguiente más actual de la colección de comentarios.
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

/**
 * Actualiza el texto del comentario especificado en el parámetro. Después de 
 * guardarlo en la colección, lo actualiza en todos los muros en donde se encuentre.
 */
async function updateComment(req, res) {
    try {
        const commId = req.params.id;
        // Comprobamos que existe la publicación y que el usuario es el autor
        let comm = await Comm.findOne({ _id: commId });
        if (!comm) {
            throw new Error('El comentario indicado no existe');
        } else if (comm.uid != req.user) {
            throw new Error(
                'No puedes borrar los comentarios de otros usuarios'
            );
        }

        const result = await Comm.updateOne(
            { _id: req.params.id },
            { t: req.body.text }
        );
        
        // Actualizar los comentarios en los mueros.
        const w = await Wall.updateMany(
            { 'p.c._id': mongoose.Types.ObjectId(req.params.id) },
            { $set: { 'p.$[x].c.$[y].t': req.body.text } },
            {
                arrayFilters: [
                    { 'x._id': comm.pid },
                    { 'y._id': mongoose.Types.ObjectId(req.params.id) }
                ]
            }
        );
        res.json(result);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

/**
 * Añade un like al comentario y registra el nick de usuario en el array ln (like 
 * nicknames)
 */
async function addLike(req, res) {
    try {
        if (!req.body.commId) {
            throw new Error(
                `Error al añadir el 'Me gusta': debes especificar el ID del comentario`
            );
        }
        // Cargamos los datos del comentario
        const comm = await Comm.findOne({ _id: req.body.commId });
        if (!comm) {
            throw new Error('El comentario indicado no existe');
        }
        // Cargamos los datos del usuario
        const user = await User.findOne({ _id: req.user });
        if (!user)
            throw new Error(
                'No se ha encontrado el usuario que ha realizado la acción'
            );
        // Actualizamos el comentario
        const result = await Comm.updateOne(
            { _id: req.body.commId, ln: { $ne: user.prof.n } },
            { $inc: { l: 1 }, $push: { ln: user.prof.n } }
        );
        if (!result) throw new Error('No se ha encontrado el comentario');
        // Actualizamos los muros
        await Wall.updateMany(
            { 'p.c._id': mongoose.Types.ObjectId(req.body.commId) },
            {
                $addToSet: { 'p.$[x].c.$[y].ln': user.prof.n },
                $inc: { 'p.$[x].c.$[y].l': 1 }
            },
            { arrayFilters: [{ 'x._id': comm.pid }, { 'y._id': comm._id }] }
        );
        res.json(result);
    } catch (err) {
        res.status(500).json({
            message: `Ha habido un error al añadir el 'Me gusta': ${
                err.message
            }`
        });
    }
}

/**
 * Quita el like del comentario y elimina el nickname del usuario del array ln
 */
async function removeLike(req, res) {
    try {
        if (!req.body.commId) {
            throw new Error(
                `Error al añadir el 'Me gusta': debes especificar el ID del comentario`
            );
        }
        // Cargamos los datos del comentario
        const comm = await Comm.findOne({ _id: req.body.commId });
        if (!comm) {
            throw new Error('El comentario indicado no existe');
        }
        // Cargamos los datos del usuario
        const user = await User.findOne({ _id: req.user });
        if (!user)
            throw new Error(
                'No se ha encontrado el usuario que ha realizado la acción'
            );
        // Actualizamos el comentario
        const result = await Comm.updateOne(
            { _id: req.body.commId, ln: user.prof.n },
            { $inc: { l: -1 }, $pull: { ln: user.prof.n } }
        );
        if (!result) throw new Error('No se ha encontrado el comentario');
        // Actualizamos los muros
        const w = await Wall.updateMany(
            { 'p.c._id': mongoose.Types.ObjectId(req.body.commId) },
            {
                $pull: { 'p.$[x].c.$[y].ln': user.prof.n },
                $inc: { 'p.$[x].c.$[y].l': -1 }
            },
            { arrayFilters: [{ 'x._id': comm.pid }, { 'y._id': comm._id }] }
        );
        res.json(result);
    } catch (err) {
        res.status(500).json({
            message: `Ha habido un error al añadir el 'Me gusta': ${
                err.message
            }`
        });
    }
}

module.exports = {
    createComment,
    getComment,
    deleteComment,
    updateComment,
    addLike,
    removeLike
};
