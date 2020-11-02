const bcrypt = require('bcryptjs')
const xss = require('xss')

const regexValidation = /(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&])[\S]+/

const UsersService = {

    hasUserWithUserName(db, username) {
        return db('users')
            .where({ username })
            .first()
            .then(user => !!user)
    },

    validatePass(password) {
        if (password.length < 8) {
            return 'Password must be longer than 8 characters'
        }
        if (password.length > 50) {
            return 'Password must be shorter than 50 characters'
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
            .into('users')
            .returning('*')
            .then(([user]) => user)
    },
}

module.exports = UsersService