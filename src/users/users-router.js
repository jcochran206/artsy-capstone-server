const express = require('express')
const xss = require('xss')
const usersRouter = express.Router()
const jsonParser = express.json()
const path = require('path')
const UsersService = require('./users-service')

const serializeUser = user => ({
    id: user.id,
    username: xss(user.username),
    pwd: user.pwd,
    email: user.email,
    bio: user.bio,
    date_created: new Date(user.date_created)
})


usersRouter
    .post('/', jsonParser, (req, res, next) => {

        const { username, pwd, email } = req.body

        for (const field of Object.keys({ username, pwd, email })) {
            if (!req.body[field]) {
                return res.status(400).json({ error: `Missing ${field} in request body.` })
            }
        }

        const passErr = UsersService.validatePass(password)

        if (passErr) {
            return res.status(400).json({ error: passErr })
        }

        UsersService.hasUserWithUserName(
            req.app.get('db'),
            username
        )
            .then(hasUser => {
                if (hasUser) {
                    return res.status(400).json({ error: `Username already exists` })
                }

                return UsersService.hashPassword(password)
                    .then(hashedPass => {
                        const newUser = {
                            username,
                            pwd: hashedPass,
                            email,
                            bio,
                            date_created: 'now()',
                        }

                        return UsersService.insertUser(req.app.get('db'), newUser)
                            .then(user => {
                                res.status(201)
                                    .location(path.posix.join(req.originalUrl, `/${user.id}`))
                                    .json(UsersService.serializeUser(user))
                            })
                    })
            })
    })

module.exports = usersRouter