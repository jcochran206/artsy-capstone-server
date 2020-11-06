const express = require('express')
const xss = require('xss')
const postRouter = express.Router()
const jsonParser = express.json()
const path = require('path')
const postService = require('./posts-service')
// const UsersService = require('../users/users-service')

const serializePost = (post) => ({
    id: post.id,
    userid: post.userid,
    title: post.title,
    pic: post.pic,
    desc_post: post.desc_post,
})


postRouter
    .route('/:id')
    .get((req, res, next) => {
        const { id } = req.params;
        postService.getPostsById(req.app.get('db'), id)
            .then(post => {
                if(!post) {
                    return res
                        .status(404)
                        .send({error: {message: `User doesn't exist.`} })
                }
                res.json(post)
                next()
            })
            .catch(next)
    })
    //update
    .put(jsonParser, (req, res, next) => {
        const {title, desc_post} = req.body;
        const postToUpdate = {
            title,
            desc_post
        }

        const numberOfValues = Object.values(postToUpdate).filter(Boolean).length
        if(numberOfValues === 0)
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