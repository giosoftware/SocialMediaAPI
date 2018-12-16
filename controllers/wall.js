'use strict';

const Wall = require('../models/wall');

function getWall(req, res) {
    Wall.findOne({ _id: req.params.id })
        .then(result => {
            if (result == null) res.send('No se han encontrado registros');
            else res.send(result);
        })
        .catch(err => {
            res.send(err);
        });
}

module.exports = { getWall };
