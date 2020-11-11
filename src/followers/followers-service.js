const followersService = {

    // get all
    getFollowers(db) {
        return db
            .from('followers')
            .select(
            'follower.id',
            )
    },

    // get by id
    getFollowerById(db, followerId) {
        return db
            .from('followers')
            .select('*')
            .where('follower.id', followerId)
            .first()
    },

    // post
    followUser(db, user_id, follower_id) {
        return db.insert({
            user_id, follower_id
        })
        .into('followers')
        .returning('*')
        .then(([follower]) => follower)
    },

    // delete
    unfollowUser(db, user_id, follower_id) {
        return db('followers')
            .where({ user_id, follower_id })
            .delete()
    }
}

module.exports = followersService;