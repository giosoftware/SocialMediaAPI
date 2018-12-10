'use strict'

module.exports = {
    port: process.env.port || 3000,
    db: process.env.MONGODB_URI || 'mongodb://localhost:27017/socialnetwork',
    SECRET_TOKEN: 'miclavedetokens',
}