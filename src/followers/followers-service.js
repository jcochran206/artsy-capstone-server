const followersService = {

    // get all
    getFollowers(db, follower_id) {
        return db
            .from('followers')
            .select('*')
            .where('followers.follower_user_id', follower_id)
    },
    // get by id
    getFollowingById(db, userid) {
        return db
            .from('followers')
            .select('follower_user_id', 'username')
            .join('users', {'users.id': 'followers.follower_user_id'})
            .where('followers.followed_user_id', userid)
    },
    getFollowersById(db, userid){
        return db
            .from('followers')
            .select('followed_user_id', 'username')
            .join('users', {'users.id': 'followers.followed_user_id'})
            .where('followers.follower_user_id', userid)
            .orderBy('users.username', 'asc')
    },
    // post
    followUser(db, followed_user_id, follower_user_id) {
        return db.insert({
            followed_user_id, follower_user_id
        })
        .into('followers')
        .returning('*')
        .then(([follower]) => follower)
    },

    // delete
    unfollowUser(db, followed_user_id, follower_user_id) {
        return db('followers')
            .where({ followed_user_id, follower_user_id })
            .delete()
    },
}

module.exports = followersService;