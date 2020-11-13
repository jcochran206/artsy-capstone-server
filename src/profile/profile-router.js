const express = require('express')
const xss = require('xss')
const profileRouter = express.Router()
const jsonParser = express.json()
const path = require('path')
const profileService = require('./profile-service')
const { router } = require('../app')
// const UsersService = require('../users/users-service')

const serializePost = (post) => ({
    id: post.id,
    userid: post.userid,
    title: post.title,
    pic: post.pic,
    desc_post: post.desc_post,
    date_created: post.date_created,
})

profileRouter
    .route('/')
    .get((req, res, next) => {
        const knexInstance = req.app.get('db')
        profileService.getUserPosts(knexInstance)
            .then(posts => {
                res.json(posts.map(serializePost))
            })
            .catch(next)
    })
profileRouter
    .route('/:userid')

module.exports = profileRouter