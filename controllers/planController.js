const planModel = require('../models/planModel');

// create new plan
async function createPlan(req, res) {
    const { name, monthlyQuota, extraChargePerUnit } = req.body;

    if (!name || monthlyQuota == null || extraChargePerUnit == null) {
        return res.status(400).json({ error: 'name, monthlyQuota, extraChargePerUnit are required' });
    }

    try {
        const plan = await planModel.create(name, monthlyQuota, extraChargePerUnit);
        res.status(201).json(plan);
    } catch (err) {
        console.error('Error creating plan:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
}

//get plan by id
async function getPlan(req, res) {
    const planId = parseInt(req.params.id);

    try {
        const plan = await planModel.findById(planId);
        if (!plan) {
            return res.status(404).json({ error: 'Plan not found' });
        }
        res.json(plan);
    } catch (err) {
        console.error('Error fetching plan:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
}

module.exports = {
    createPlan,
    getPlan,
};