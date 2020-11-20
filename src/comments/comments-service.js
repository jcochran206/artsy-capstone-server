const xss = require('xss')

const commentsService = {

    // crud operations
    getComments(db) {
        return db
            .from('comments')
            .select('*')
    },

    getCommentById(db, commentId) {
        return db
            .from('comments')
            .select('comments.user_id', 'comments.desc_comment', 'users.username')
            .join('users', {'users.id': 'comments.user_id'})
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
        return db('comments')
            .where({
                id: commentId,
            })
            .update(newComment)
            .returning('*')
    },

    deleteComment(db, id) {
        return db('comments')
            .where({ id })
            .delete()
    },

    getAllCommentsInPost(db, id){
        return db
            .from('comments')
            .select('comments.desc_comment', 'user_id', 'username')
            .join('users', {'users.id': 'comments.user_id'})
            .where('comments.post_id', id)
    }
}

module.exports = commentsService;