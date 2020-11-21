const knex = require('knex')
const supertest = require('supertest')
const app = require('../src/app')
const bcrypt = require('bcryptjs')
const helpers = require('./test-helpers')

describe.only('Users Endpoints', function () {
    let db

    const { testUsers } = helpers.makeFixtures()
    const testUser = testUsers[0]

    before('make knex instance', () => {
        db = knex({
            client: 'pg',
            connection: process.env.TEST_DATABASE_URL,
        })
        app.set('db', db)
    })

    after('disconnect from db', () => db.destroy())

    before('cleanup', () => helpers.cleanTables(db))

    afterEach('cleanup', () => helpers.cleanTables(db))

    describe(`POST /api/users`, () => {
        context(`User Validation`, () => {
            beforeEach('insert users', () => helpers.seedUsers(
                db,
                testUsers,
            )
            )

            const requiredFields = ['username', 'pwd', 'email']

            requiredFields.forEach(field => {
                const registerAttemptBody = {
                    username: 'test username',
                    pwd: 'test password',
                    email: 'test full_name',
                    bio: 'test nickname',
                }

                it(`responds with 400 required error when '${field}' is missing`, () => {
                    delete registerAttemptBody[field]

                    return supertest(app)
                        .post('/api/users')
                        .send(registerAttemptBody)
                        .expect(400, {
                            error: `Missing ${field} in request body.`,
                        })
                })
            })

            it(`responds 400 'Password be longer than 8 characters' when empty password`, () => {
                const userShortPassword = {
                    username: 'test username',
                    pwd: '1234567',
                    email: 'test full_name',
                }
                return supertest(app)
                    .post('/api/users')
                    .send(userShortPassword)
                    .expect(400, { error: `Password must be longer than 8 characters` })
            })

            it(`responds 400 'Password must be less than 72 characters' when long password`, () => {
                const userLongPassword = {
                    username: 'test username',
                    pwd: '*'.repeat(73),
                    email: 'test full_name',
                }
                return supertest(app)
                    .post('/api/users')
                    .send(userLongPassword)
                    .expect(400, { error: `Password must be shorter than 50 characters` })
            })

            it(`responds 400 error when password starts with spaces`, () => {
                const userPasswordStartsSpaces = {
                    username: 'test username',
                    pwd: ' 1Aa!2Bb@',
                    email: 'test full_name',
                }
                return supertest(app)
                    .post('/api/users')
                    .send(userPasswordStartsSpaces)
                    .expect(400, { error: `Password may not start or end with spaces` })
            })

            it(`responds 400 error when password ends with spaces`, () => {
                const userPasswordEndsSpaces = {
                    username: 'test username',
                    pwd: '1Aa!2Bb@ ',
                    email: 'test full_name',
                }
                return supertest(app)
                    .post('/api/users')
                    .send(userPasswordEndsSpaces)
                    .expect(400, { error: `Password may not start or end with spaces` })
            })

            it(`responds 400 error when password isn't complex enough`, () => {
                const userPasswordNotComplex = {
                    username: 'test username',
                    pwd: '11AAaabb',
                    email: 'test full_name',
                }
                return supertest(app)
                    .post('/api/users')
                    .send(userPasswordNotComplex)
                    .expect(400, { error: `password must contain at least one upper-case, lower-case, number, and special character` })
            })

            it(`responds 400 'User name already taken' when username isn't unique`, () => {
                const duplicateUser = {
                    username: testUser.username,
                    pwd: '11AAaa!!',
                    email: 'test full_name',
                }
                return supertest(app)
                    .post('/api/users')
                    .send(duplicateUser)
                    .expect(400, { error: `email address is not valid` })
            })
        })

        context(`Happy path`, () => {
            it(`responds 201, serialized user, storing bcryped password`, () => {
                const newUser = {
                    username: 'test username',
                    pwd: '11AAaa!!',
                    email: 'none@none.com',
                }
                return supertest(app)
                    .post('/api/users')
                    .send(newUser)
                    .expect(201)
                    .expect(res => {
                        expect(res.body).to.have.property('id')
                        expect(res.body.username).to.eql(newUser.username)
                        expect(res.body.email).to.eql(newUser.email)
                        expect(res.headers.location).to.eql(`/api/users/${res.body.id}`)
                    })
                    .expect(res =>
                        db
                            .from('users')
                            .select('*')
                            .where({ id: res.body.id })
                            .first()
                            .then(row => {
                                expect(row.username).to.eql(newUser.username)
                                expect(row.email).to.eql(newUser.email)

                                return bcrypt.compare(newUser.pwd, row.pwd)
                            })
                            .then(compareMatch => {
                                expect(compareMatch).to.be.true
                            })
                    )
            })
        })
    })
})
