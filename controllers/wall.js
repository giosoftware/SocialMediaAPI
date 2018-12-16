'use strict';

const Wall = require('../models/wall');

function getWall(req, res) {
    Wall.findOne({ _id: req.params.id })
        .then(result => {
            if (!result) res.status(404).json({message: 'No se han encontrado registros'});
            else res.json(result);
        })
        .catch(err => {
            res.status(500).json({message: err.message});
        });
}

module.exports = { getWall };
