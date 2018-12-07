'use strict';

const connectionDB = require('../config/database.js');
const User = require('../models/user');

const create = (req, res) => {
    const user = {
        fn: req.body.firstName,
        ln: req.body.lastName,
        prof: {
            u: req.body.profile.username,
            ps: req.body.profile.password,
            e: req.body.profile.email
        },
        c: req.body.circles
    };

    User.create(user)
        .then(result => {
            res.send(result);
        })
        .catch(err => {
            res.send(err);
        });
};

const read = (req, res) => {
    User.findOne({ _id: req.params.id })
        .then(result => {
            if (result == null) res.send('No records found');
            else res.send(result);
        })
        .catch(err => {
            res.send(err);
        });
};

const del = (req, res) => {
    User.deleteOne({ _id: req.params.id })
        .then(result => {
            if (result == null) res.send('No records found');
            else res.send(result);
        })
        .catch(err => {
            res.send(err);
        });
};

const update = (req, res) => {
    console.log('id: ' + req.params.id);

    const user = {
        fn: req.body.firstName,
        ln: req.body.lastName,
        prof: {
            u: req.body.profile.username,
            ps: req.body.profile.password,
            e: req.body.profile.email
        },
        c: req.body.circles,
        b: req.body.blocked
    };

    User.updateOne({ _id: req.params.id }, user)
        .then(result => {
            if (result == null) res.send('No records found');
            else res.send(result);
        })
        .catch(err => {
            res.send(err);
        });
};

module.exports = { create, read, del, update };
