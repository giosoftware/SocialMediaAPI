'use strict';

const Post = require('../models/post');

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

function addLike(req, res) {
    Post.updateOne({ _id: req.body.postId }, { $inc: { l: 1 } })
        .then(result => {
            if (result == null) res.send('No se han encontrado registros');
            else res.send(result);
        })
        .catch(err => {
            res.send(err);
        });
}

module.exports = { create, read, del, update, addLike };
