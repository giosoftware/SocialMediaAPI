'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const postSchema = new Schema({
    uid: {
        type: Schema.Types.ObjectId,
        required: [true, 'el ID del usuario es obligatorio'],
        alias: 'user_id'
    },
    n: {
        type: String,
        required: [true, 'el campo apodo es obligatorio'],
        alias: 'nickname'
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
    i: {
        type: [String],
        required: [true, 'el campo intereses es obligatorio'],
        alias: 'interests'
    },
    l: {
        type: Number,
        alias: 'likes'
    },
    ln: {
        type: [String],
        alias: 'likes_nicknames'
    }
}, { versionKey: false });

const Post = mongoose.model('post', postSchema);

module.exports = Post;
