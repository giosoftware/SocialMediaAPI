'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const commentSchema = new Schema({
    _id: {
        type: Schema.Types.ObjectId
        //,required: [true, 'el ID del comentario es obligatorio']
    },
    uid: {
        type: Schema.Types.ObjectId,
        required: [true, 'el ID del usuario es obligatorio'],
        alias: 'user_id'
    },
    un: {
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
});

const postSchema = new Schema({
    _id: {
        type: Schema.Types.ObjectId
        //,required: [true, 'el ID de la publicación es obligatorio']
    },
    uid: {
        type: Schema.Types.ObjectId,
        required: [true, 'el ID del usuario es obligatorio'],
        alias: 'user_id'
    },
    un: {
        type: String,
        required: [true, 'el campo nickname es obligatorio'],
        alias: 'text'
    },
    d: {
        type: Date,
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
    },
    co: {
        type: [commentSchema],
        alias: 'comments'
    }
});

const wallSchema = new Schema({
    uid: {
        type: Schema.Types.ObjectId,
        required: [true, 'el ID del usuario es obligatorio'],
        alias: 'user_id'
    },
    un: {
        type: String,
        required: [true, 'el campo apodo es obligatorio'],
        alias: 'nickname'
    },
    m: {
        type: String,
        required: [true, 'el campo mes es obligatorio'],
        alias: 'month'
    },
    p: {
        type: [postSchema],
        alias: 'posts'
    }
});

const Wall = mongoose.model('wall', wallSchema);

module.exports = Wall;
