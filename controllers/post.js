'use strict';

const mongoose = require('mongoose');

const Post = require('../models/post');
const User = require('../models/user');
const Wall = require('../models/wall');
const Comm = require('../models/comment');

/**
 * Cuando un usuario añade un post hay que crearlo en su colección. También hay
 * que añadirla en su muro y en todos los muros de los usuarios interesados,
 * exceptuando aquellos que han bloquedo al usuario.
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

async function addPostToWalls(post, userId) {
    var d = new Date();
    var month = '' + d.getUTCFullYear() + (d.getUTCMonth() + 1);
    try {
        var currentUser = await User.findOne({_id: userId});
        if (!currentUser) throw new Error('Error al añadir una publicación a los muros: no se ha encontrado el usuario actual');

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

function getPost(req, res) {
    Post.findOne({ _id: req.params.id })
        .then(result => {
            if (!result) res.status(404).json({message: 'No se han encontrado registros'});
            else res.json(result);
        })
        .catch(err => {
            res.status(500).json({message: err.message});
        });
}

/**
 * Cuando un usuario borra una publicación hay que confirmar que es suya.
 * Después hay que elimnarla de su colección, además de borrar los comentarios
 * relacionados. Después hay que elininar esa publicación de todos los muros.
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

function updatePost(req, res) {
    const post = {
        uid: req.body.userId,
        n: req.body.nickname,
        t: req.body.text,
        i: req.body.interests,
        l: req.body.likes,
        ln: req.body.likesNicknames
    };

    Post.updateOne({ _id: req.params.id }, post)
        .then(result => {
            if (!result) res.status(404).json({message: 'No se han encontrado registros'});
            else res.json(result);
        })
        .catch(err => {
            res.status(500).json({message: err.message});
        });
}

async function addLike(req, res) {
    try {
        const user = await User.findOne({ _id: req.user });
        if (!user)
            throw new Error(
                'No se ha encontrado el usuario que ha realizado la acción.'
            );
        const post = await Post.updateOne(
            { _id: req.body.postId },
            { $inc: { l: 1 }, $push: { ln: user.prof.n } }
        );
        if (!post) throw new Error('No se ha encontrado la publicación.');
        else res.json(post);
    } catch (err) {
        res.status(500).json({
            message: `Ha habido un error al añadir el 'Me gusta': ${
                err.message
            }`
        });
    }
}

module.exports = { createPost, getPost, deletePost, updatePost, addLike };
