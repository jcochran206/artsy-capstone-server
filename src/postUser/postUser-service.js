//select u.username, u.bio, p.title, p.pic, p.desc_post from users u , posts p where u.userid = p.user_id;
//select u.username, l.user_id, l.isliked, p.title, p.desc_post from users u , likes l, posts p where u.userid = l.user_id and p.id = l.post_id;
const postUsersService = {
    getPostUsers(db) {
        return db
            .join('posts', {'posts.id':'users.userid'})
            .from('users')
            .select(
                '*'
            )
    }
}
module.exports = postUsersService