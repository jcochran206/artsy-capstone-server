const express = require('express')
const xss = require('xss')
const commentsRouter = express.Router()
const jsonParser = express.json()
const { requireAuth }= require('../middleware/jwt-auth')
const path = require('path')
const commentsService = require('./comments-service')
const UsersService = require('../users/users-service')
const { getCommentById } = require('./comments-service')

const serializeComment = (comment) => ({
    id: comment.id,
    desc_comment: xss(comment.desc_comment),
    user_id: comment.user_id,
    post_id: comment.post_id,
    username: comment.username
})


commentsRouter
    .route('/')
    .get((req, res, next) => {
        const knexInstance = req.app.get('db')
        commentsService.getComments(knexInstance)
            .then(comments => {
                res.json(comments.map(serializeComment))
            })
            .catch(next)
    })
    .post(jsonParser, requireAuth, (req, res, next) => {
        const { desc_comment, post_id } = req.body
        const knexInstance = req.app.get('db')
        
        if (desc_comment === null)
            return res.status(400).json({
                error: {
                    message: `Missing description in request body.`
                }
            })
        const newComment = { desc_comment: desc_comment, user_id: req.user.id, post_id: post_id }

        commentsService.insertComment(
            knexInstance,
            newComment
        )
            .then(comment => {
                commentsService.getCommentById(knexInstance, comment.id)
                .then(commentInfo => {
                    res
                        .status(201)
                        .location(path.posix.join(req.originalUrl, `/${comment.id}`))
                        .json(commentInfo)

                })
            })
            .catch(next)
    })

commentsRouter
    .route('/:id')
    .get((req, res, next) => {
        const { id } = req.params;
        const knexInstance = req.app.get('db')

        commentsService.getCommentById(
            knexInstance,
            id
        )
            .then(comment => {
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
    .patch(jsonParser, (req, res, next) => {
        const { comment } = req.body

        if (comment === null)
            return res.status(400).json({
                error: {
                    message: `missing ${comment} in request body`
                }
            })

        const commentToUpdate = { comment }

        commentsService.updateComment(
            req.app.get('db'),
            req.params.id,
            commentToUpdate
        )
            .then(updatedComment => {
                res.status(200).json(serializeComment(updatedComment[0]))
            })
            .catch(next)
    })
    .delete((req, res, next) => {
        const { id } = req.params

        commentsService.deleteComment(
            req.app.get('db'),
            id
        )
            .then(rowsAffected => {
                res.status(204).end()
            })
            .catch(next)
    })


commentsRouter
    .route('/post/:id')
    .get((req, res, next) => {
        const { id } = req.params
        commentsService.getAllCommentsInPost(req.app.get('db'), id)
        .then(comments => {
            if(!comments){
                return res.status(404).json({
                    error: {
                        message: `comment does not exist`
                    }
                })
            }
            res.status(200).json(comments)
            next()
        })
        .catch(next)
    })
module.exports = commentsRouter
