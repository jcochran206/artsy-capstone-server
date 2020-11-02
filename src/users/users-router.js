const express = require('express')
const xss = require('xss')
const usersRouter = express.Router()
const jsonParser = express.json()
const path = require('path')
const usersService = require('./users-service')

const serializeUser = (user) => ({
    id: user.id,
    username: xss(user.username),
    pwd: user.pwd,
    email: user.email,
    bio: user.bio,
    date_created: new Date(user.date_created)
})


usersRouter
    .route('/')
    .get((req, res, next) => {
    const knexInstance = req.app.get('db')
    usersService.getUsers(knexInstance)
        .then(users => {
            res.json(users.map(serializeUser))
        })
        .catch(next)
    })
    .post(jsonParser, (req, res, next) => {

        const { username, pwd, email } = req.body;
        
        console.log("username:", username, "pwd:", pwd)

        // for (const field of Object.keys({ username, pwd, email })) {
        //     if (!req.body[field]) {
        //         return res.status(400).json({ error: `Missing ${field} in request body.` })
        //     }
        // }
        for (const field of ['username', 'pwd', 'email'])
            if(field === null)
                return res.status(400).json({
                    error:{
                        message: `Missing ${field} in request body.`
                    }
                })
                const newUser = {username, pwd, email};
                usersService.insertUser(
                    req.app.get('db'),
                    newUser
                )
                .then(user => {
                    res
                    .status(201)
                    .location('/users/:userid')
                    .json(serializeUser(user))
                })
                .catch(next)

        const passErr = usersService.validatePass(pwd)

        if (passErr) {
            return res.status(400).json({ error: passErr })
        }

        usersService.hasUserWithUserName(
            req.app.get('db'),
            username
        )
            .then(hasUser => {
                if (hasUser) {
                    return res.status(400).json({ error: `Username already exists` })
                }

                return usersService.hashPassword(pwd)
                    .then(hashedPass => {
                        const newUser = {
                            username,
                            pwd: hashedPass,
                            email,
                            bio,
                            date_created: 'now()',
                        }

                        return usersService.insertUser(req.app.get('db'), newUser)
                            .then(user => {
                                res.status(201)
                                    .location(path.posix.join(req.originalUrl, `/${user.id}`))
                                    .json(usersService.serializeUser(user))
                            })
                    })
            })
            .catch(next)
    })

module.exports = usersRouter