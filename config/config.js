'use strict'

module.exports = {
    port: process.env.port || 3000,
    db: process.env.MONGODB_URI || 'mongodb://localhost:27017/socialmedia',
    SECRET_TOKEN: 'iVURKmZG-D1iB3uszgMtRoNlUAcrPvmOZHeSDmI4b3ahcOrF9u7fFHdfmrRgmd4-GljqQsiWeV7K5UyRvQ2SJQ',
}