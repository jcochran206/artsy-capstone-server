const followersService = {

    // get all
    getFollowers(db, follower_id) {
        return db
            .from('followers')
            .select('*')
            .where('followers.follower_id', follower_id)
    },

    // get by id
    getFollowerById(db, followerId) {
        return db
            .from('followers')
            .select('*')
            .where('followers.id', followerId)
            .first()
    },

    // post
    followUser(db, followed_id, follower_id) {
        return db.insert({
            followed_id, follower_id
        })
        .into('followers')
        .returning('*')
        .then(([follower]) => follower)
    },

    // delete
    unfollowUser(db, followed_id, follower_id) {
        return db('followers')
            .where({ followed_id, follower_id })
            .delete()
    }
}

module.exports = followersService;