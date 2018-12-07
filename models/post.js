'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const postSchema = new Schema({
    uid: {
        type: Schema.Types.ObjectId,
        required: [true, 'el ID del usuario es obligatorio'],
        alias: 'user_id'
    },
    un: {
        type: String,
        required: [true, 'el campo nombre de usuario es obligatorio'],
        alias: 'username'
    },
    d: {
        type: Date,
        default: Date.now,
        required: [true, 'el campo fecha es obligatorio'],
        alias: 'date'
    },
    t: {
        type: String,
        required: [true, 'el campo texto es obligatorio'],
        alias: 'text'
    },
    c: {
        type: [String],
        required: [true, 'el campo círculos es obligatorio'],
        alias: 'interests'
    },
    l: {
        type: Number,
        alias: 'likes'
    },
    lun: {
        type: [String],
        alias: 'likes_usernames'
    }
});

const Post = mongoose.model('post', postSchema);

module.exports = Post;
