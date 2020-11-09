const xss = require('xss')

const commentsService = {

    // crud operations
    getComments(db) {
        return db
            .from('comments')
            .select(
            'comments.id',
            'comments.desc_comment'
            )
    },

    getCommentById(db, commentId) {
        return db
            .from('comments')
            .select('*')
            .where('comments.id', id)
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

    deleteComment(db, userid) {
        return db('comments')
            .where({
                userid: userid,
                comment: id
            })
            .delete()
    },
}

module.exports = commentsService;