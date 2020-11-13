const express = require('express')
const xss = require('xss')
const followersRouter = express.Router()
const jsonParser = express.json()
const path = require('path')
const { requireAuth } = require('../middleware/jwt-auth')
const followersService = require('./followers-service')

followersRouter
    .route('/')
    .get(requireAuth, (req, res, next) => {
        const id = req.user.id
        const knexInstance = req.app.get('db')
        followersService.getFollowers(
            knexInstance,
            id
            )
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
                if (!follower) {
                    return res.status(404).json({
                        error: {
                            message: `follower does not exist`
                        }
                    })
                }
                res.status(200).json(follower)
                next()
            })
            .catch(next)
    })
    .post(jsonParser, requireAuth, (req, res, next) => {
        const follower_id = req.user.id
        const followed_id = req.params.id

        const knexInstance = req.app.get('db')
        console.log('follower id:', follower_id,'|', 'followed id:', followed_id)

        if(!followed_id) {
            return res.status(400).json({
                error: {
                    message: `Invalid 'follower_id'. please try again.`
                }
            })
        }

       followersService.followUser(
           knexInstance,
           follower_id,
           followed_id,
       )
       .then(followed => {
           res.status(201).json({ message: `user ${follower_id} followed user ${followed_id}.`})
       })
       .catch(next)
    })
    .delete(requireAuth, (req, res, next) => {
        const follower_id = req.user.id
        const followed_id = req.params.id
        const knexInstance = req.app.get('db')

        console.log('follower id:', follower_id,'|', 'followed id:', followed_id)

        followersService.unfollowUser(
            knexInstance,
            follower_id,
            followed_id
        )
        .then(rowsAffected => {
            res.status(201).json({ message: `user ${follower_id} unfollowed user ${followed_id}.`})
        })
        .catch(next)
    })

module.exports = followersRouter
