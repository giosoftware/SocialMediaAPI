'use strict';

const connectionDB = require('../config/database.js');
const Comm = require('../models/comment');

const create = (req, res) => {
    const comm = {
        uid: req.body.userId,
        un: req.body.username,
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
};

const read = (req, res) => {
    Comm.findOne({ _id: req.params.id })
        .then(result => {
            if (result == null) res.send('No records found');
            else res.send(result);
        })
        .catch(err => {
            res.send(err);
        });
};

const del = (req, res) => {
    Comm.deleteOne({ _id: req.params.id })
        .then(result => {
            if (result == null) res.send('No records found');
            else res.send(result);
        })
        .catch(err => {
            res.send(err);
        });
};

const update = (req, res) => {
    const comm = {
        uid: req.body.userId,
        un: req.body.username,
        d: req.body.date,
        t: req.body.text,
        c: req.body.interests,
        l: req.body.likes,
        lun: req.body.likesUsernames
    };

    Comm.updateOne({ _id: req.params.id }, comm)
        .then(result => {
            if (result == null) res.send('No records found');
            else res.send(result);
        })
        .catch(err => {
            res.send(err);
        });
};

module.exports = { create, read, del, update };
