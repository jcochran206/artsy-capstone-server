process.env.TZ = 'UTC'
process.env.NODE_ENV = 'test'
process.env.JWT_SECRET = 'jwt-secret'
process.env.JWT_EXPIRY = '5m'

require('dotenv').config()

process.env.TEST_DB_URL = process.env.TEST_DB_URL
  || "postgresql://USERNAME@localhost/DB_NAME"

const { expect } = require('chai')
const supertest = require('supertest')

global.expect = expect
global.supertest = supertest