'use strict'

const service = require('../services/index');

/**
 * Comprueba que el usuario está autorizado 
 */
function isAuth(req, res, next) {
    if (!req.headers.authorization || req.headers.authorization === 'undefined') {
        return res.status(403).json({ message: 'You do not have authorization' });
    }
    // JWT es del tipo "Bearer xdfañhiiugsda"
    const token = req.headers.authorization.split(' ')[1];

    service.decodeToken(token)
        .then((result) => {
            req.user = result;
            next();
        }).catch((err) => {
            res.status(err.status).json({message: err.message});
        });
}

module.exports = isAuth;