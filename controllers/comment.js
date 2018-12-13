'use strict';

const Comm = require('../models/comment');
const User = require('../models/user');

function create(req, res) {
    const comm = {
        uid: req.user,
        n: req.body.nickname,
        t: req.body.text,
        pid: req.body.postId
    };

    Comm.create(comm)
        .then(result => {
            res.send(result);
        })
        .catch(err => {
            res.send(err);
        });
}

function read(req, res) {
    Comm.findOne({ _id: req.params.id })
        .then(result => {
            if (result == null) res.send('No se han encontrado registros');
            else res.send(result);
        })
        .catch(err => {
            res.send(err);
        });
}

function del(req, res) {
    Comm.deleteOne({ _id: req.params.id })
        .then(result => {
            if (result == null) res.send('No se han encontrado registros');
            else res.send(result);
        })
        .catch(err => {
            res.send(err);
        });
}

function update(req, res) {
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
        if (!user) throw new Error('No se ha encontrado el usuario que ha realizado la acción');
        const comm = await Comm.updateOne(
            { _id: req.body.commId },
            { $inc: { l: 1 }, $push: { ln: user.prof.n } }
        );
        if (!comm) throw new Error('No se ha encontrado el comentario');
        else res.send(comm);
    } catch (err) {
        res.status(500).send({'message': `Ha habido un error al añadir el 'Me gusta': ${err.message}`});
    }
}

module.exports = { create, read, del, update, addLike };