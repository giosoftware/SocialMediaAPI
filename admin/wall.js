'use strict';

const Wall = require('../models/wall');
const User = require('../models/user');
const Post = require('../models/post');
const Comm = require('../models/comment');

async function generateCurrentMonthWall(user) {
    console.log('3. generateCurrentMonthWall');
    try {
        if (user) {
            let wall = getBasicWallDoc(user);
            wall = await insertPostsAndComments(user, wall);
            await Wall.create(wall);
        } else {
            let users = await User.find();
            for (let user of users) {
                let wall = getBasicWallDoc(user);
                await Wall.create(wall);
            }
        }
    } catch (err) {
        throw err;
    }
}

function getBasicWallDoc(user) {
    let wall = {};
    const currentMonth = getCurrentMonth();
    wall.uid = user._id;
    wall.n = user.prof.n;
    wall.i = user.i; // Quitar después de las pruebas
    wall.m = currentMonth;
    wall.p = [];

    return wall;
}

async function insertPostsAndComments(user, wall) {
    try {
        let posts = await Post.aggregate([
            {
                $match: {
                    $or: [
                        { uid: user._id },
                        {
                            $and: [
                                { i: { $in: user.i } },
                                { uid: { $nin: user.b } }
                            ]
                        }
                    ]
                }
            },
            {
                $lookup: {
                    from: 'comments',
                    as: 'c',
                    let: { postId: '$_id' },
                    pipeline: [
                        {
                            $match: {
                                $expr: { $eq: ['$pid', '$$postId'] }
                            }
                        },
                        { $sort: { d: -1 } },
                        { $limit: 3 }
                    ]
                }
            },
            {
                $sort: { d: -1 }
            }
        ]);

        wall.p = posts;

        return wall;
    } catch (err) {
        throw err;
    }
}

function getCurrentMonth() {
    var d = new Date();
    return '' + d.getUTCFullYear() + (d.getUTCMonth() + 1);
}

module.exports = { generateCurrentMonthWall };

/*
// SÓLO PARA PRUEBAS
// Open db connection
const config = require('../config/config');
const mongoose = require('mongoose');
mongoose.set('useCreateIndex', true); // To avoid DeprecationWarning
mongoose.connect(
    config.db,
    { useNewUrlParser: true },
    (err, res) => {
        if (err) {
            return console.log(`Error al conectar la bd: ${err}`);
        }
        console.log('Conexion establecida');
    }
);

async function init() {
    try {
        let user;
        // user = await User.findOne({fn: 'Cristina'})
        console.log('EMPEZAMOS');
        await generateCurrentMonthWall(user);
        console.log('TERMINAMOS');
    } catch (err) {
        console.error('Init error: ' + err.message);
    } finally {
        mongoose.connection.close();
    }
}

init();
*/
