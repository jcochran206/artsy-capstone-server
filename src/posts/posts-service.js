
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

    //get for profile page (followed users)
    getFeed(db, user_id) {
        return db
            .from('posts')
            .join('followers', 'posts.user_id', 'followers.followed_id')
            .join('users', 'users.id', 'followers.followed_id')
            .where('followers.follower_id', user_id)
    },

    //get for profile page ()
    getProfile(db) {
        return db
            .join('posts', {'posts.id':'users.userid'})
            .from('users')
            .select(
                '*'
            )
    }


}

module.exports = postService