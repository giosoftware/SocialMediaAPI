'use strict';

const Wall = require('../models/wall');

function create(req, res) {
    const wall = {
        uid: req.body.userId,
        un: req.body.nickname,
        m: req.body.month,
        p: req.body.posts
    };

    Wall.create(wall)
        .then(result => {
            res.send(result);
        })
        .catch(err => {
            res.send(err);
        });
};

function read(req, res) {
    Wall.findOne({ _id: req.params.id })
        .then(result => {
            if (result == null) res.send('No se han encontrado registros');
            else res.send(result);
        })
        .catch(err => {
            res.send(err);
        });
};

function del(req, res) {
    Wall.deleteOne({ _id: req.params.id })
        .then(result => {
            if (result == null) res.send('No se han encontrado registros');
            else res.send(result);
        })
        .catch(err => {
            res.send(err);
        });
};

function update(req, res) {
    const wall = {
        uid: req.body.userId,
        un: req.body.nickname,
        m: req.body.month,
        p: req.body.posts
    };

    Wall.updateOne({ _id: req.params.id }, wall)
        .then(result => {
            if (result == null) res.send('No se han encontrado registros');
            else res.send(result);
        })
        .catch(err => {
            res.send(err);
        });
};

module.exports = { create, read, del, update };
