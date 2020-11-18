const express = require('express')
const xss = require('xss')
const path = require('path')
const postService = require('./posts-service')
const { requireAuth } = require('../middleware/jwt-auth')
// const UsersService = require('../users/users-service')

const postRouter = express.Router()
const jsonParser = express.json()

const serializePost = (post) => ({
    id: post.id,
    user_id: post.user_id,
    title: xss(post.title),
    pic: xss(post.pic),
    desc_post: xss(post.desc_post),
    date_created: post.date_created,
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
    .post(requireAuth, jsonParser, (req, res, next) => {
        const { title, pic, desc_post } = req.body
        const newPost = { title, pic, desc_post }

        for (const [key, value] of Object.entries(newPost)) {
            if (value == null) {
                return res.status(400).json({
                    error: `Missing '${key} in request body`
                })
            }
        }
        newPost.user_id = req.user.id   // via requireAuth > AuthService

        postService.insertPost(
            req.app.get('db'),
            newPost
        )
            .then(post => {
                res
                    .status(201)
                    .location(path.posix.join(req.originalUrl, `/${post.id}`))
                    .json(serializePost(post))
            })
            .catch(next)
    })

postRouter
    .route('/feed/:id')
    .get((req, res, next) => {
        const { id } = req.params;
        postService.getFeed(req.app.get('db'), id)
            .then(post => {
                if (!post) {
                    return res
                        .status(404)
                        .send({ error: { message: `User doesn't exist.` } })
                }
                res.json(post)
                next()
            })
            .catch(next)
    })

postRouter
    .route('/profile')
    .get((req, res, next) => {
        const knexInstance = req.app.get('db')
        postService.getProfile(knexInstance)
            .then(posts => {
                res.json(posts.map(serializePost))
            })
            .catch(next)
    })

postRouter
    .route('/:id')
    .get((req, res, next) => {
        const { id } = req.params;
        postService.getPostsById(req.app.get('db'), id)
            .then(post => {
                if (!post) {
                    return res
                        .status(404)
                        .send({ error: { message: `User doesn't exist.` } })
                }
                res.json(post)
                next()
            })
            .catch(next)
    })
<<<<<<< HEAD
    
=======

>>>>>>> 5587196c4073da01db832b0536f4ced4731a566a
    //update
    .put(jsonParser, (req, res, next) => {
        const { title, desc_post } = req.body;
        const postToUpdate = {
            title,
            desc_post
        }

        const numberOfValues = Object.values(postToUpdate).filter(Boolean).length
        if (numberOfValues === 0)
            return res.status(400).json({
                error: {
                    message: `Request body must content either title or description`
                }
            })

        postService.updatePost(
            req.app.get('db'),
            req.params.id,
            postToUpdate
        )
            .then(updatePost => {
                res.status(200).json(serializePost(updatePost[0]))
            })
            .catch(next)
    })
    // delete route 
    .delete((req, res, next) => {
        const { id } = req.params;
        postService.deletePost(
            req.app.get('db'),
            req.params.id
        )
            .then(numRowsAffected => {
                res.status(204).end()
            })
            .catch(next)
    })


module.exports = postRouter