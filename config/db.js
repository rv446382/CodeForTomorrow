const { Pool } = require('pg');
require('dotenv').config();   


const pool = new Pool({
    user: process.env.DB_USER || 'postgres',
    host: process.env.DB_HOST || 'localhost',
    database: process.env.DB_NAME || 'subscription_db',
    password: process.env.DB_PASSWORD || 'admin@123',
    port: process.env.DB_PORT || 5432,
});


pool.connect()
    .then(() => console.log('PostgreSQL connected successfully!!'))
    .catch(err => console.error('PostgreSQL connection error', err.message));


module.exports = {
    query: (text, params) => pool.query(text, params),
};