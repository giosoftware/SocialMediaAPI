'use strict';

const Post = require('../models/post');
const User = require('../models/user');

function create(req, res) {
    const post = {
        uid: req.user,
        un: req.body.nickname,
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
        un: req.body.nickname,
        t: req.body.text,
        i: req.body.interests,
        l: req.body.likes,
        lun: req.body.likesNicknames
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
