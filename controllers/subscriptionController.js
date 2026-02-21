const subscriptionModel = require('../models/subscriptionModel');
const userModel = require('../models/userModel');
const planModel = require('../models/planModel');

//create new subscription
async function createSubscription(req, res) {
    const { userId, planId } = req.body;

    if (!userId || !planId) {
        return res.status(400).json({ error: 'userId and planId are required' });
    }

    try {
        const user = await userModel.findById(userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const plan = await planModel.findById(planId);
        if (!plan) {
            return res.status(404).json({ error: 'Plan not found' });
        }

        const subscription = await subscriptionModel.create(userId, planId);
        res.status(201).json(subscription);
    } catch (err) {
        console.error('Error creating subscription:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
}

//get active subscription for a user
async function getActiveSubscription(req, res) {
    const userId = parseInt(req.params.userId);

    try {
        const subscription = await subscriptionModel.findActiveByUser(userId);
        if (!subscription) {
            return res.status(404).json({ error: 'No active subscription found for this user' });
        }

        const plan = await planModel.findById(subscription.planid);
        res.json({
            subscription,
            plan,
        });
    } catch (err) {
        console.error('Error fetching subscription:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
}

module.exports = {
    createSubscription,
    getActiveSubscription,
};