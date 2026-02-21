const db = require('../config/db');

async function create(userId, planId) {
    await db.query(
        'UPDATE subscriptions SET isActive = false WHERE userId = $1 AND isActive = true',
        [userId]
    );

    const result = await db.query(
        'INSERT INTO subscriptions (userId, planId, startDate, isActive) VALUES ($1, $2, CURRENT_DATE, true) RETURNING *',
        [userId, planId]
    );
    return result.rows[0];
}

async function findActiveByUser(userId) {
    const result = await db.query(
        'SELECT id, userId, planId, startDate, isActive FROM subscriptions WHERE userId = $1 AND isActive = true LIMIT 1',
        [userId]
    );
    return result.rows[0];
}

module.exports = {
    create,
    findActiveByUser,
};