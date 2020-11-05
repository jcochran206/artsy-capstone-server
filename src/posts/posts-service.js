
const postService = {

    //crud functions 
    getPosts(db) {
        return db
            .from('posts')
            .select(
                '*'
            )
    },
    //get by Id
    getPostsById(db, id) {
        return db
        .from('posts')
        .select('*')
        .where(posts.id, id)
        .first()
    },
    //insert post
    insertPost(db, newPost) {
        return db.insert(newPost)
            .into('posts')
            .returning('*')
            .then(([post]) => post)
    },
    //update post
    updatepost(db, id, newPost) {
        return db('posts')
            .where({
                id: id
            })
            .update(newPost, returning = true)
            .returning('*')
    },
    //delete post
    deletepost(db, id) {
        return db('posts')
            .where({
                id: id
            })
            .delete()
    }
}

module.exports = postService