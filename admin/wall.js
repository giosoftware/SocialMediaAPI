'use strict';

const Wall = require('../models/wall');
const User = require('../models/user');
const Post = require('../models/post');
const Comm = require('../models/comment');

async function createCurrentMonthWall(userId) {
    const currentMonth = getCurrentMonth();
    const criteria = {};

    if (userId) criteria = { _id: userId }

    try {
        console.log('currentmonth: ' + currentMonth);
        console.log('voy a llamar a find con criteria: ' + criteria);
        const users = await User.find({});
        console.log(`Se han encontrado: ${users.length} usuarios`);
        users.forEach(user => {
            console.log(user.nickname);
        });
    } catch (err) {
        console.error(`Se ha producido un error al generar el muro para este mes: ${err.message}`);
    }


}

function addWallDocument(userId, nickname, month, posts) {
    const wall = {
        uid: req.body.userId,
        n: req.body.nickname,
        m: currentMonth,
        p: req.body.posts
    };

    Wall.create(wall)
        .then(result => {
            res.send(result);
        })
        .catch(err => {
            console.err(err.message);
        });

}

function getCurrentMonth() {
    const dateObj = new Date();
    const month = dateObj.getUTCMonth() + 1; //months from 1-12
    const year = dateObj.getUTCFullYear();

    return "" + year + month;
}

createCurrentMonthWall();