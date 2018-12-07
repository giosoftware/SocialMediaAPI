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
    pid: {
        type: Schema.Types.ObjectId,
        required: [true, 'el ID de la publicación es obligatorio'],
        alias: 'post_id'
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
        required: [true, 'el campo username es obligatorio'],
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
        required: [true, 'el campo nombre de usuario es obligatorio'],
        alias: 'username'
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
