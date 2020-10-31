const knex = require('knex')
const app = require('../src/app')
const helpers = require('./test-helpers')

describe('App', () => {
  it('GET / responds with 200 containing "Express Boilerplate!"', () => {
    return supertest(app)
      .get('/')
      .expect(200, 'Express Boilerplate!')
  })
})