const db = require('../config/db');

async function create(name) {
    const result = await db.query(
        'INSERT INTO users (name) VALUES ($1) RETURNING id, name',
        [name]
    );
    return result.rows[0];
}

async function findById(id) {
    const result = await db.query('SELECT id, name FROM users WHERE id = $1', [id]);
    return result.rows[0];
}

module.exports = {
    create,
    findById,
};