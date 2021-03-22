require('dotenv').config()

const knex = require('knex')
const app = require('./app')
const { PORT, DATABASE_URL } = require('./config')

// !IMPORTANT Correct SSL flag for Heroku
const pg = require('pg');
pg.defaults.ssl = process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false;

const db = knex({
  client: 'pg',
  connection: DATABASE_URL,
})

app.set('db', db)

app.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${PORT}`)
})