'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const cron = require('node-cron');

const admin = require('./admin/wall');
const config = require('./config/config');
const globalRoutes = require('./routes/global');

const app = express();
const mongoose = require('mongoose');


mongoose.connect(config.db, { useNewUrlParser: true })
.then(res => console.log('Conexión a mongodb establecida'))
.catch(err => {
    console.error(`Error al conectar la bd: ${err}`);
    process.exit(1);
});

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }));

// Usamos un enrutador global
app.use('/api/', globalRoutes);

/**
 * Planificamos una tarea para que el día 1 a las 00:00 de cada mes se genere un 
 * muro básico (sin publicaciones).
 */
/*
* * * * * *
| | | | | |
| | | | | day of week
| | | | month
| | | day of month
| | hour
| minute
second ( optional )
*/
cron.schedule('* * * 1 * *', function() {
    console.log('---------------------');
    console.log(`Creamos los muros para este mes: ${Date()}`);
    /**
     * Las funciones asincronas retornan promesas, así que no se pueden recoger
     * los posibles errores con un bloque try catch.
     */
        admin.generateCurrentMonthWall().catch(err => {
            console.error(
                `Ha habido un error al generar los muros del mes: ${
                    err.message
                }`
            );
        });
});

app.listen(config.port, () => {
    console.log(`API REST corriendo en http://localhost:${config.port}`);
});
