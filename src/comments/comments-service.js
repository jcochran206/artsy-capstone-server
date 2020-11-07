const xss = require('xss')

const commentsService = {

    // crud operations
    getComments(db) {
        return db
            .from('comments')
            .select(
            'comments.id',
            'comments.comment',
            'comments.user_id'
            )
    },

    getCommentById(db, commentId) {
        return db
            .from('comments')
            .select('*')
            .where('comments.id', commentId)
            .first()
    },

    insertComment(db, newComment) {
        return db.insert(newComment)
            .into('comments')
            .returning('*')
            .then(([comment]) => comment)
    },

    updateComment(db, userId, postId, commentId, newComment) {
        return db('comments')
            .where({
                userid: userId,
                postid: postId,
                commentid: commentId,
            })
            .update(newComment, returning = true)
            .returning('*')
    },

    deleteComment(db, userid, commentId) {
        return db('comments')
            .where({
                userid: userid,
                comment: commentId
            })
            .delete()
    },
}

module.exports = commentsService;