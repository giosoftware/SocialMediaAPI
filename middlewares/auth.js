'use strict'

const service = require('../services/index');

function isAuth(req, res, next) {
    if (!req.headers.authorization || req.headers.authorization === 'undefined') {
        return res.status(403).send({ message: 'No tienes autorización' });
    }
    // JWT es del tipo "Bearer xdfañhiiugsda"
    const token = req.headers.authorization.split(' ')[1];

    service.decodeToken(token)
        .then((result) => {
            req.user = result;
            next();
        }).catch((err) => {
            res.status(err.status).send(err.message)
        });
}

module.exports = isAuth;