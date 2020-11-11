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

    updateComment(db, commentId, newComment) {
        console.log('newComment', newComment)
        return db('comments')
            .where({
                id: commentId,
            })
            .update(newComment)
            .returning('*')
    },

    deleteComment(db, id) {
        console.log(id)
        return db('comments')
            .where({ id })
            .delete()
    },
}

module.exports = commentsService;