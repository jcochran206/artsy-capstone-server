const express = require('express')
const xss = require('xss')
const postUserRouter = express.Router()
const jsonParser = express.json()
const path = require('path')
const postUserService = require('./postUser-service')
// const UsersService = require('../users/users-service')

const serializePost = (post) => ({
    id: post.id,
    userid: post.userid,
    title: post.title,
    pic: post.pic,
    desc_post: post.desc_post,
})

postUserRouter
    .route('/')
    .get((req, res, next) => {
        const knexInstance = req.app.get('db')
        postUserService.getPostUsers(knexInstance)
            .then(posts => {
                res.json(posts.map(serializePost))
            })
            .catch(next)
    })

module.exports = postUserRouter