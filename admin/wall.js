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

async function createCurrentMonthWall(userId) {
    const currentMonth = getCurrentMonth();
    let criteria = {};

    if (userId) criteria = { _id: userId }

    try {
        let users = await User.find(criteria);
        users.forEach(user => {
            console.log(user.nickname);
            addWallDocument(user, currentMonth);
        });
    } catch (err) {
        console.error(`Se ha producido un error al generar el muro para este mes: ${err.message}`);
    }
}

function addWallDocument(user, currentMonth) {
    const wall = {
        uid: user._id,
        n: user.nickname,
        m: currentMonth
    };

    Wall.create(wall)
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
createCurrentMonthWall();