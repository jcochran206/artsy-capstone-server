const bcrypt = require('bcryptjs')
const xss = require('xss')

const regexPasswordValidation = /(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&])[\S]+/
const regexEmailValidation = /[^@ \t\r\n]+@[^@ \t\r\n]+\.[^@ \t\r\n]+/
const UsersService = {

    //validate functions
    hasUserWithUserName(db, username) {
        return db('users')
            .where({ username })
            .first()
            .then(user => !!user)
    },

    hasUserWithUsernameThatAintMine(db, id, username) {
        return db('users')
            .where({ username })
            .first()
            .returning('*')
            .then(user => {
                if (user) {
                    if (Number(user.id) !== Number(id)) {
                        return !!user
                    }
                }
            })
    },

    validatePass(pwd) {
        if (pwd.length < 8) {
            return 'Password must be longer than 8 characters'
        }
        if (pwd.length > 50) {
            return 'Password must be shorter than 50 characters'
        }
        if (pwd.startsWith(' ') || pwd.endsWith(' ')) {
            return 'Password may not start or end with spaces'
        }
        if (!regexPasswordValidation.test(pwd)) {
            return 'password must contain at least one upper-case, lower-case, number, and special character'
        }
    },

    validateEmail(email) {
        if (!regexEmailValidation.test(email)) {
            return 'email address is not valid'
        }
    },

    hashPassword(pwd) {
        return bcrypt.hash(pwd, 12)
    },
    //crud functions 
    getUsers(db) {
        return db
            .from('users')
            .select(
                '*'
            )
            .orderBy('username', 'asc')
    },
    //get user by Id
    getUsersById(db, userid) {
        return db
            .from('users')
            .select(
                '*'
            )
            .where('users.id', userid)
            .first()
    },
    //insert user
    insertUser(db, newUser) {
        return db.insert(newUser)
            .into('users')
            .returning('*')
            .then(([user]) => user)
    },
    //update user
    updateUser(db, userid, newUser) {
        return db('users')
            .where({
                id: userid
            })
            .update(newUser, returning = true)
            .returning('*')
    },
    //delete user
    deleteUser(db, userid) {
        return db('users')
            .where({
                userid: userid
            })
            .delete()
    },
    //get posts by user
    getUsersPosts(db, userid){
        return db
        .from('posts')
        .select('posts.id', 'posts.user_id', 'posts.title', 'posts.pic', 'posts.desc_post', 'posts.date_created', 'users.username')
        .join('users', {'users.id': 'posts.user_id'})
        .where('posts.user_id', userid)
        .orderBy('posts.date_created', 'asc')
    }
}

module.exports = UsersService