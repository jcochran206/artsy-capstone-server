const express = require('express')
const xss = require('xss')
const commentsRouter = express.Router()
const jsonParser = express.json()
const path = require('path')
const commentsService = require('./comments-service')

const serializeComment = (comment) => ({
    id: comment.id,
    desc: xss(comment.desc),
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
    .post(jsonParser, (req, res, next) => {
        const desc = req.body
        const knexInstance = req.app.get('db')

        if (desc === null)
            return res.status(400).json({
                error: {
                    message: `Missing description in request body.`
                }
            })

        const newComment = desc;

        commentsService.insertComment(
            knexInstance,
            newComment
        )
            .then(comment => {
                res
                    .status(201)
                    .location(path.posix.join(req.originalUrl, `/${comment.id}`))
                    .json(serializeComment(comment))
            })
            .catch(next)
    })

commentsRouter
    .route('/:commentId')
    .all((req, res, next) => {
        const { commentId } = req.params;
        const knexInstance = req.app.get('db')

        commentsService.getCommentById(
            knexInstance,
            commentId
        )
            .then(commentId => {
                if (!commentId) {
                    return res.status(404).json({
                        error: {
                            message: `comment does not exist`
                        }
                    })
                }
                res.commentId = commentId
                next()
            })
            .catch(next)
    })
    .get((req, res) => {
        res.json(serializeComment(res.commentId))
    })
    .patch(jsonParser, (req, res, next) => {
        const { id, desc } = req.body
        const updatedComment = { id, desc }

    })

module.exports = commentsRouter
