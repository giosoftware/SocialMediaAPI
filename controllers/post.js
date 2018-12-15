'use strict';

const Post = require('../models/post');
const User = require('../models/user');

/**
 * Cuando un usuario añade un post hay que crearlo en su colección. También hay
 * que añadirla en su muro y en todos los muros de los usuarios interesados, 
 * exceptuando aquellos que han bloquedo al usuario.
 */
function create(req, res) {
    const post = {
        uid: req.user,
        n: req.body.nickname,
        t: req.body.text,
        i: req.body.interests
    };

    Post.create(post)
        .then(result => {
            res.send(result);
        })
        .catch(err => {
            res.send(err);
        });
}

function read(req, res) {
    Post.findOne({ _id: req.params.id })
        .then(result => {
            if (result == null) res.send('No se han encontrado registros');
            else res.send(result);
        })
        .catch(err => {
            res.send(err);
        });
}

/**
 * Cuando un usuario borra una publicación hay que elimnarla de su colección, 
 * además de borrar los comentarios relacionados. Después hay que elininar esa
 * publicación de todos los muros.
 */
function del(req, res) {
    Post.deleteOne({ _id: req.params.id })
        .then(result => {
            if (result == null) res.send('No se han encontrado registros');
            else res.send(result);
        })
        .catch(err => {
            res.send(err);
        });
}

function update(req, res) {
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
        if (!user) throw new Error('No se ha encontrado el usuario que ha realizado la acción.');
        const post = await Post.updateOne(
            { _id: req.body.postId },
            { $inc: { l: 1 }, $push: { ln: user.prof.n } }
        );
        if (!post) throw new Error('No se ha encontrado la publicación.');
        else res.send(post);
    } catch (err) {
        res.status(500).send({'message': `Ha habido un error al añadir el 'Me gusta': ${err.message}`});
    }
}

module.exports = { create, read, del, update, addLike };
