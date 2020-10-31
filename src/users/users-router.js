const express = require('express')
const usersRouter = express.Router()
const jsonParser = express.json()
const path = require('path')
const UsersService = require('./users-service')

usersRouter
    .post('/', jsonParser, (req, res, next) => {

        const { full_name, nickname, user_name, password } = req.body

        for (const field of Object.keys({ full_name, user_name, password })) {
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
            user_name
        )
            .then(hasUser => {
                if (hasUser) {
                    return res.status(400).json({ error: `Username already exists` })
                }

                return UsersService.hashPassword(password)
                    .then(hashedPass => {
                        const newUser = {
                            user_name,
                            password: hashedPass,
                            full_name,
                            nickname,
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