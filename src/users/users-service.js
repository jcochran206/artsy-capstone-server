const bcrypt = require('bcryptjs')
const xss = require('xss')

const regexValidation = /(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&])[\S]+/

const UsersService = {

    hasUserWithUserName(db, user_name) {
        return db('mtg_users')
            .where({ user_name })
            .first()
            .then(user => !!user)
    },

    validatePass(password) {
        if (password.length < 8) {
            return 'Password must be longer than 8 characters'
        }
        if (password.length > 72) {
            return 'Password must be shorter than 72 characters'
        }
        if (password.startsWith(' ') || password.endsWith(' ')) {
            return 'Password may not start or end with spaces'
        }
        if(!regexValidation.test(password)) {
            return 'password must contain at least one upper-case, lower-case, number, and special character'
        }
    },

    hashPassword(password) {
        return bcrypt.hash(password, 12)
    },

    insertUser(db, newUser) {
        return db.insert(newUser)
            .into('mtg_users')
            .returning('*')
            .then(([user]) => user)
    },

    serializeUser(user) {
        return {
            id: xss(user.id),
            user_name: xss(user.user_name),
            full_name: xss(user.full_name),
            nickname: xss(user.nickname),
            date_created: new Date(user.date_created),
        }
    }
}

module.exports = UsersService