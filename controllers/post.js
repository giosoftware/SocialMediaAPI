'use strict';

const mongoose = require('mongoose');

const Post = require('../models/post');
const User = require('../models/user');
const Wall = require('../models/wall');
const Comm = require('../models/comment');

/**
 * Crea una nueva publiación en su colección. También la añade en su muro y en 
 * todos los muros de los usuarios interesados, exceptuando aquellos que han 
 * bloquedo al usuario.
 */
async function createPost(req, res) {
    try {
        let post = {
            uid: req.user,
            n: req.body.nickname,
            t: req.body.text,
            i: req.body.interests
        };

        post = await Post.create(post);
        await addPostToWalls(post, req.user);
        res.status(201).json(post);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

/**
 * Añade una publicación en todos los muros de los usuarios interesados, 
 * excluyendo los muros de los usuarios que están bloqueados.
 */
async function addPostToWalls(post, userId) {
    var d = new Date();
    var month = '' + d.getUTCFullYear() + (d.getUTCMonth() + 1);
    try {
        var currentUser = await User.findOne({ _id: userId });
        if (!currentUser)
            throw new Error(
                'Error al añadir una publicación a los muros: no se ha encontrado el usuario actual'
            );

        var users = await User.find({
            $or: [
                { _id: currentUser._id },
                {
                    $and: [
                        { i: { $in: post.i } },
                        { b: { $nin: [currentUser._id] } },
                        { _id: { $nin: currentUser.b } }
                    ]
                }
            ]
        });

        for (let user of users) {
            await Wall.updateMany(
                { m: month, uid: user._id },
                {
                    $push: {
                        p: {
                            $each: [post],
                            $position: 0
                        }
                    }
                }
            );
        }
    } catch (err) {
        throw err;
    }
}

/**
 * Devuelve el documento de la publicación especificada.
 */
function getPost(req, res) {
    Post.findOne({ _id: req.params.id })
        .then(result => {
            if (!result)
                res.status(404).json({
                    message: 'No records found'
                });
            else res.json(result);
        })
        .catch(err => {
            res.status(500).json({ message: err.message });
        });
}

/**
 * Elimina una publicación de su colección, además de borrar los comentarios
 * relacionados. También elinina esa publicación de todos los muros.
 */
async function deletePost(req, res) {
    const postId = req.params.id;
    try {
        // Comprobamos que existe la publicación y que el usuario es el autor
        const post = await Post.findOne({ _id: postId });
        if (!post) {
            throw new Error('La publicación indicada no existe');
        } else if (post.uid != req.user) {
            throw new Error(
                'No puedes borrar las publicaciones de otros usuarios'
            );
        }

        // Borrar de los muros
        await Wall.updateMany(
            {},
            {
                $pull: {
                    p: { _id: mongoose.Types.ObjectId(postId) }
                }
            }
        );
        // Borrar los comentarios de la publicación
        await Comm.deleteMany({ pid: postId });
        // Borrar la publicación de su colección
        await Post.deleteOne({ _id: postId }).then(result => {
            res.json(result);
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

/**
 * Modifica la publicación especificada en el parámetro, además de actualizarla
 * en los muros donde se encuentre.
 */
async function updatePost(req, res) {
    try {
        // Comprobamos que existe la publicación y que el usuario es el autor
        const post = await Post.findOne({ _id: req.params.id });
        if (!post) {
            throw new Error('La publicación indicada no existe');
        } else if (post.uid != req.user) {
            throw new Error(
                'No puedes actualizar las publicaciones de otros usuarios'
            );
        }

        const result = await Post.updateOne(
            { _id: req.params.id }, 
            {t: req.body.text, i: req.body.interests}
        );
        // Actualizamos los muros
        await Wall.updateMany(
            { 'p._id': mongoose.Types.ObjectId(req.params.id) },
            { $set: { 'p.$.t': req.body.text, 'p.$.i': req.body.interests } }
        );

        res.json(result); 
    } catch (err) {
        res.status(500).json({ message: err.message });
    }  
}

/**
 * Añade un like a la publicación especificada en el parámetro, tanto en su 
 * colección como en los muros en donde se encuentre.
 */
async function addLike(req, res) {
    try {
        if (!req.body.postId) {
            throw new Error(
                `Error al añadir el 'Me gusta': debes especificar el ID de la publicación`
            );
        }
        const user = await User.findOne({ _id: req.user });
        if (!user)
            throw new Error(
                'No se ha encontrado el usuario que ha realizado la acción.'
            );
        const post = await Post.updateOne(
            { _id: req.body.postId, ln: { $ne: user.prof.n } },
            { $inc: { l: 1 }, $push: { ln: user.prof.n } }
        );
        if (!post) throw new Error('No se ha encontrado la publicación.');
        // Actualizamos los muros
        await Wall.updateMany(
            { 'p._id': mongoose.Types.ObjectId(req.body.postId) },
            { $addToSet: { 'p.$.ln': user.prof.n }, $inc: { 'p.$.l': 1 } }
        );
        res.json(post);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

/**
 * Elimina el like de la publicación especificada en el parámetro, tanto en su
 * colección como en los muros en donde se encuentre.
 */
async function removeLike(req, res) {
    try {
        if (!req.body.postId) {
            throw new Error(
                `Error al añadir el 'Me gusta': debes especificar el ID de la publicación`
            );
        }
        const user = await User.findOne({ _id: req.user });
        if (!user)
            throw new Error(
                'No se ha encontrado el usuario que ha realizado la acción.'
            );
        const post = await Post.updateOne(
            { _id: req.body.postId, ln: user.prof.n },
            { $inc: { l: -1 }, $pull: { ln: user.prof.n } }
        );
        if (!post) throw new Error('No se ha encontrado la publicación.');
        // Actualizamos los muros
        const w = await Wall.updateMany(
            { 'p._id': mongoose.Types.ObjectId(req.body.postId) },
            { $pull: { 'p.$.ln': user.prof.n }, $inc: { 'p.$.l': -1 } }
        );
        res.json(post);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

module.exports = {
    createPost,
    getPost,
    deletePost,
    updatePost,
    addLike,
    removeLike
};
