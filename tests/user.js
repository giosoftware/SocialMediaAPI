'use strict';

// NPM install mongoose and chai. Make sure mocha is globally
// installed
const mongoose = require('mongoose');
const User = require('../models/user');
const dbConnConn = require('../config/database');
const chai = require('chai');
const expect = chai.expect;

describe('Database Tests', function () {
    //Before starting the test, create a sandboxed database connection
    //Once a connection is established invoke done()
    before(function (done) {
        dbConn.on('error', console.error.bind(console, 'connection error'));
        dbConn.once('open', function () {
            console.log('We are connected to test database!');
            done();
        });
    });
    describe('Test Database', function () {
        //Save object with 'User' value of 'Mike"
        it('New User saved to test database', function (done) {
            var testUser = User({
                firstName: 'Cristina',
                lastName: 'Martín'
            });

            testUser.save(done);
        });
        it('Dont save incorrect format to database', function (done) {
            //Attempt to save with wrong info. An error should trigger
            var wrongSave = User({
                notUser: 'Not Mike'
            });
            wrongSave.save(err => {
                if (err) { return done(); }
                throw new Error('Should generate error!');
            });
        });
        it('Should retrieve data from test database', function (done) {
            //Look up the 'Mike' object previously saved.
            User.find({ User: 'Mike' }, (err, User) => {
                if (err) { throw err; }
                if (User.length === 0) { throw new Error('No data!'); }
                done();
            });
        });
    });
    //After all tests are finished drop database and close connection
    after(function (done) {
        mongoose.connection.dbConn.dropDatabase(function () {
            mongoose.connection.close(done);
        });
    });
});