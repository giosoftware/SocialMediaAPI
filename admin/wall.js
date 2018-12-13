'use strict';

const Wall = require('../models/wall');
const User = require('../models/user');
const Post = require('../models/post');
const Comm = require('../models/comment');

// Open db connection
const config = require('../config/config');
const mongoose = require('mongoose');
mongoose.set('useCreateIndex', true); // To avoid DeprecationWarning
mongoose.connect(config.db, { useNewUrlParser: true }, (err, res) => {
    if (err) {
        return console.log(`Error al conectar la bd: ${err}`);
    }
    console.log('Conexion establecida');
});

async function generateCurrentMonthWall(userId) {
    let criteria = {};

    if (userId) criteria = { _id: userId }

    try {
        let users = await User.find(criteria);
        users.forEach(user => {
            //console.log(user.nickname);
            let wall = generateWallDoc(user);
            addWallDocument(wall);
        });
    } catch (err) {
        console.error(`Se ha producido un error al generar el muro para este mes: ${err.message}`);
    }
}

function generateWallDoc(user) {
    let wall = {}
    const currentMonth = getCurrentMonth();
    wall.uid = user._id;
    wall.n = user.prof.n;
    wall.i = user.i; // Hidde after tests
    wall.m = currentMonth;
    wall.p = [];

    var posts = db.posts.aggregate([
        { $project: {__v: 0} },
        {
            $match: {
                $or: [
                    { uid: user._id },
                    {
                        $and: [{ i: { $in: user.i } }, { uid: { $nin: user.b } }]
                    }
                ]
            }
        },
        { $sort: { d: -1 } }
    ]);

    while (posts.hasNext()) {
        post = posts.next();
        comms = db.comments.find({pid: post._id, uid: { $nin: user.b }}, {__v:0}).limit(3).sort({d: -1})
        post.comm = comms.toArray();
        wall.p.push(post);
    }

    return wall;
}

function addWallDocument(doc) {
    Wall.create(doc)
        .then(result => {
            console.log(result);
        })
        .catch(err => {
            console.error(err.message);
        });
}

function getCurrentMonth() {
    const dateObj = new Date();
    const month = dateObj.getUTCMonth() + 1; //months from 1-12
    const year = dateObj.getUTCFullYear();

    return "" + year + month;
}

//createCurrentMonthWall("5c10d68c453fdb2d44a779f3");
generateCurrentMonthWall();