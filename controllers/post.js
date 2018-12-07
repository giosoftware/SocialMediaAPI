'use strict';

const connectionDB = require('../config/database.js');
const Post = require('../models/post');

const create = (req, res) => {
    const post = {
        uid: req.body.userId,
        un: req.body.username,
        t: req.body.text,
        c: req.body.circles
    };

    Post.create(post)
        .then(result => {
            res.send(result);
        })
        .catch(err => {
            res.send(err);
        });
};

const read = (req, res) => {
    Post.findOne({ _id: req.params.id })
        .then(result => {
            if (result == null) res.send('No records found');
            else res.send(result);
        })
        .catch(err => {
            res.send(err);
        });
};

const del = (req, res) => {
    Post.deleteOne({ _id: req.params.id })
        .then(result => {
            if (result == null) res.send('No records found');
            else res.send(result);
        })
        .catch(err => {
            res.send(err);
        });
};

const update = (req, res) => {
    const post = {
        uid: req.body.userId,
        un: req.body.username,
        t: req.body.text,
        c: req.body.circles,
        l: req.body.likes,
        lun: req.body.likesUsernames
    };

    Post.updateOne({ _id: req.params.id }, post)
        .then(result => {
            if (result == null) res.send('No records found');
            else res.send(result);
        })
        .catch(err => {
            res.send(err);
        });
};

module.exports = { create, read, del, update };
