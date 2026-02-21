const db = require('../config/db');

async function create(name, monthlyQuota, extraChargePerUnit) {
    const result = await db.query(
        'INSERT INTO plans (name, monthlyQuota, extraChargePerUnit) VALUES ($1, $2, $3) RETURNING *',
        [name, monthlyQuota, extraChargePerUnit]
    );
    return result.rows[0];
}

async function findById(id) {
    const result = await db.query(
        'SELECT id, name, monthlyQuota, extraChargePerUnit FROM plans WHERE id = $1',
        [id]
    );
    return result.rows[0];
}

module.exports = {
    create,
    findById,
};