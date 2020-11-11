const express = require('express')
const xss = require('xss')
const followersRouter = express.Router()
const jsonParser = express.json()
const path = require('path')
const followersService = require('./followers-service')


followersRouter
    .route('/')
    .get((req, res, next) => {
        const knexInstance = req.app.get('db')
        followersService.getFollowers(knexInstance)
            .then(followers => {
                res.json(followers)
            })
            .catch(next)
    })

followersRouter
    .route('/:id')
    .get((req, res, next) => {
        const { id } = req.params;
        const knexInstance = req.app.get('db')

        followersService.getFollowerById(
            knexInstance,
            id
        )
            .then(follower => {
                if (!comment) {
                    return res.status(404).json({
                        error: {
                            message: `comment does not exist`
                        }
                    })
                }
                res.status(200).json(comment)
                next()
            })
            .catch(next)
    })
    // .post(jsonParser, requireAuth, (req, res, next) => {
        // const id = req.user.id
        // const knexInstance = 
    // })

module.exports = followersRouter
