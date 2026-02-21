const db = require('../config/db');

async function create(userId, action, usedUnits) {
    const result = await db.query(
        'INSERT INTO usageRecords (userId, action, usedUnits, createdAt) VALUES ($1, $2, $3, NOW()) RETURNING *',
        [userId, action, usedUnits]
    );
    return result.rows[0];
}

async function getCurrentMonthTotal(userId) {
    const result = await db.query(
        `SELECT COALESCE(SUM(usedUnits), 0) as total 
     FROM usageRecords 
     WHERE userId = $1 
       AND DATE_TRUNC('month', createdAt) = DATE_TRUNC('month', CURRENT_DATE)`,
        [userId]
    );
    return parseFloat(result.rows[0].total);
}

module.exports = {
    create,
    getCurrentMonthTotal,
};