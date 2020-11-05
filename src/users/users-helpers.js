hasUserWithUserName(db, username) {
    return db('users')
        .where({ username })
        .first()
        .then(user => !!user)
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
    if(!regexValidation.test(pwd)) {
        return 'password must contain at least one upper-case, lower-case, number, and special character'
    }
},

hashPassword(pwd) {
    return bcrypt.hash(pwd, 12)
},