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

        for (const field of ['username', 'pwd', 'email']) {
            if (field === null) {
                return res.status(400).json({
                    error: {
                        message: `Missing ${field} in request body.`
                    }
                })
            }
        }
        const { bio } = req.body
        const newUser = { username, pwd, email, bio };
        

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
                                    .json(serializeUser(user))
                            })
                    })
            })
            .catch(next)
    })
usersRouter
    .route('/:userid')
    .all((req, res, next) => {
        const { userid } = req.params;
        usersService.getUsersById(req.app.get('db'), userid)
            .then(userid => {
                if (!userid) {
                    return res
                        .status(404)
                        .send({ error: { message: `user does not exist` } })
                }
                res.userid = userid
                next()
            })
            .catch(next)
    })
    .get((req, res) => {
        res.json(serializeUser(res.userid))
    })
    .put(jsonParser, (req, res, next) => {
        const userid = req.params.userid
        const { username, pwd, email, bio} = req.body
        const userToUpdate = { username, pwd, email, bio}

        const numberOfValues = Object.values(userToUpdate).filter(Boolean).length
        if (numberOfValues === 0)
            return res.status(400).json({
                error: {
                    message: `Request body does not contain pwd, email, and bio`
                }
            })
        usersService.updateUser(
            req.app.get('db'),
            userid,
            userToUpdate
        )
            .then(updateUser => {
                res.status(200).json(serializeUser(updateUser[0]))
            })
            .catch(next)
    })

module.exports = usersRouter