'use strict';

const connectionDB = require('../config/database.js');
const Wall = require('../models/wall');

const create = (req, res) => {
    const wall = {
        uid: req.body.userId,
        un: req.body.username,
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

const read = (req, res) => {
    Wall.findOne({ _id: req.params.id })
        .then(result => {
            if (result == null) res.send('No records found');
            else res.send(result);
        })
        .catch(err => {
            res.send(err);
        });
};

const del = (req, res) => {
    Wall.deleteOne({ _id: req.params.id })
        .then(result => {
            if (result == null) res.send('No records found');
            else res.send(result);
        })
        .catch(err => {
            res.send(err);
        });
};

const update = (req, res) => {
    const wall = {
        uid: req.body.userId,
        un: req.body.username,
        m: req.body.month,
        p: req.body.posts
    };

    Wall.updateOne({ _id: req.params.id }, wall)
        .then(result => {
            if (result == null) res.send('No records found');
            else res.send(result);
        })
        .catch(err => {
            res.send(err);
        });
};

module.exports = { create, read, del, update };
