'use strict';

const Wall = require('../models/wall');
const User = require('../models/user');
const Post = require('../models/post');
const Comm = require('../models/comment');

/**
 * Esta función es llamada por el Cron el primero de mes para crear los documentos
 * de los muros de los usuarios. Esta función también es llamada cuando se registra
 * un nuevo usuario, pasándole los datos en el parámetro user. En este último caso
 * al documento del muro también se añadirán los posts y comentarios que sean de su 
 * interés.
 * @param {Object} user (optional)
 */
async function generateCurrentMonthWall(user) {
    try {
        if (user) {
            let wall = getBasicWallDoc(user);
            wall = await insertPostsAndComments(user, wall);
            await Wall.create(wall);
        } else {
            let users = await User.find();
            for (let user of users) {
                let wall = getBasicWallDoc(user);
                //wall = await insertPostsAndComments(user, wall); // Nada que añadir el día 1 a las 00:00
                await Wall.create(wall);
            }
        }
    } catch (err) {
        throw err;
    }
}

/**
 * Genera un documento básico (sin publicaciones ni comentarios) de un muro para 
 * el mes actual.
 * @param {Object} user 
 */
function getBasicWallDoc(user) {
    let wall = {};
    const currentMonth = getCurrentMonth();
    wall.uid = user._id;
    wall.n = user.prof.n;
    // wall.i = user.i; // Quitar después de las pruebas
    wall.m = currentMonth;
    wall.p = [];

    return wall;
}

/**
 * Añade las publicaciones de interés y comentarios correspondientes al documento 
 * wall del usuario pasado como parámetro. Se excluyen las publicaciones de los
 * usuarios bloqueados.
 * @param {Object} user 
 * @param {Object} wall 
 */
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

/**
 * Genera un string YYYYMM para el mes en curso
 */
function getCurrentMonth() {
    var d = new Date();
    return '' + d.getUTCFullYear() + (d.getUTCMonth() + 1);
}

module.exports = { generateCurrentMonthWall };