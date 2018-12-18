'use strict';

const Wall = require('../models/wall');

/**
 * Devuelve el documento del muro del usuario para el mes especificado.
 */
function getWall(req, res) {
    const month = req.body.month;
    Wall.findOne({ uid: req.user, m: month })
        .then(result => {
            if (!result) res.status(404).json({message: 'No se han encontrado registros'});
            else res.json(result);
        })
        .catch(err => {
            res.status(500).json({message: err.message});
        });
}

module.exports = { getWall };
