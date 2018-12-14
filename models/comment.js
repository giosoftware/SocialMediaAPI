'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const commentSchema = new Schema({
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
    pid: {
        type: Schema.Types.ObjectId,
        required: [true, 'el ID de la publicación es obligatorio'],
        alias: 'post_id'
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

const Comment = mongoose.model('comment', commentSchema);

module.exports = Comment;
