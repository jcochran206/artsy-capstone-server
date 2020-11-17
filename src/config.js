module.exports = {
  PORT: process.env.PORT || 8000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  CLIENT_ORIGIN: 'http://localhost:3000' || process.env.CLIENT_ORIGIN,
  DATABASE_URL: process.env.DATABASE_URL || 'postgresql://postgres@localhost/artsy',
  TEST_DATABASE_URL: process.env.TEST_DATABASE_URL || '',
  JWT_SECRET: process.env.JWT_SECRET || 'mysecret',
  JWT_EXPIRY: process.env.JWT_EXPIRY || '5d'
}