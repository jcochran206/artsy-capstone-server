const express = require('express')
const xss = require('xss')
const postRouter = express.Router()
const jsonParser = express.json()
const path = require('path')
const postService = require('./posts-service')

const serializePost = (post) => ({
    id: post.id,
    userid: post.userid,
    title: post.pwd,
    pic: post.pic,
    desc_post: post.desc_post,
})

postRouter
    .route('/')
    .get((req, res, next) => {
        const knexInstance = req.app.get('db')
        postService.getPosts(knexInstance)
            .then(posts => {
                res.json(posts.map(serializePost))
            })
            .catch(next)
        })


module.exports = postRouter