
const postService = {

    //crud functions 
    getPosts(db) {
        return db
            .from('posts')
            .select('*')
            .orderBy('date_created', 'desc')
    },
    //get by Id
    getPostsById(db, id) {
        return db
            .from('posts')
            .select('*')
            .where({ id: id })
            .first()
    },
    //insert post
    insertPost(db, newPost) {
        return db.insert(newPost)
            .into('posts')
            .returning('*')
            .then(([post]) => post)
            // .then(post => {
            //     postService.getPostsById(db, post.id)
            // })
    },
    //update post
    updatePost(db, id, newPost) {
        return db('posts')
            .where({
                id: id
            })
            .update(newPost, returning = true)
            .returning('*')
    },
    //delete post
    deletePost(db, id) {
        return db('posts')
            .where({
                id: id
            })
            .delete()
    },


}

module.exports = postService