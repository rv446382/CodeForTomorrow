const usageModel = require('../models/usageModel');
const userModel = require('../models/userModel');
const subscriptionModel = require('../models/subscriptionModel');
const planModel = require('../models/planModel');

//record usage
async function recordUsage(req, res) {
    const { userId, action, usedUnits } = req.body;

    if (!userId || !action || usedUnits == null) {
        return res.status(400).json({ error: 'userId, action, usedUnits are required' });
    }
    if (typeof usedUnits !== 'number' || usedUnits <= 0) {
        return res.status(400).json({ error: 'usedUnits must be a positive number' });
    }

    try {
        const user = await userModel.findById(userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const subscription = await subscriptionModel.findActiveByUser(userId);
        if (!subscription) {
            return res.status(400).json({ error: 'User has no active subscription' });
        }

        const usage = await usageModel.create(userId, action, usedUnits);
        res.status(201).json({
            message: 'Usage recorded',
            usage: {
                id: usage.id,
                userId: usage.userid,
                action: usage.action,
                usedUnits: usage.usedunits,
                createdAt: usage.createdat,
            },
        });
    } catch (err) {
        console.error('Error recording usage:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
}

async function getCurrentUsage(req, res) {
    const userId = parseInt(req.params.id);

    try {
        const user = await userModel.findById(userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const subscription = await subscriptionModel.findActiveByUser(userId);
        if (!subscription) {
            return res.status(404).json({ error: 'No active subscription' });
        }

        const plan = await planModel.findById(subscription.planid);
        if (!plan) {
            return res.status(404).json({ error: 'Plan not found' });
        }

        const totalUsed = await usageModel.getCurrentMonthTotal(userId);
        const remaining = Math.max(plan.monthlyquota - totalUsed, 0);

        res.json({
            userId: user.id,
            userName: user.name,
            totalUnitsUsed: totalUsed,
            remainingUnits: remaining,
            plan: {
                id: plan.id,
                name: plan.name,
                monthlyQuota: plan.monthlyquota,
                extraChargePerUnit: parseFloat(plan.extrachargeperunit).toFixed(2),
            },
        });
    } catch (err) {
        console.error('Error in current-usage:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
}

async function getBillingSummary(req, res) {
    const userId = parseInt(req.params.id);

    try {
        const user = await userModel.findById(userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const subscription = await subscriptionModel.findActiveByUser(userId);
        if (!subscription) {
            return res.status(404).json({ error: 'No active subscription' });
        }

        const plan = await planModel.findById(subscription.planid);
        if (!plan) {
            return res.status(404).json({ error: 'Plan not found' });
        }

        const totalUsed = await usageModel.getCurrentMonthTotal(userId);
        const quota = plan.monthlyquota;
        const extraUnits = totalUsed > quota ? totalUsed - quota : 0;
        const extraCharges = extraUnits * parseFloat(plan.extrachargeperunit);

        res.json({
            userId: user.id,
            userName: user.name,
            totalUsage: totalUsed,
            plan: {
                id: plan.id,
                name: plan.name,
                monthlyQuota: quota,
                extraChargePerUnit: parseFloat(plan.extrachargeperunit).toFixed(2),
            },
            quota,
            extraUnits,
            extraCharges: extraCharges.toFixed(2),
        });
    } catch (err) {
        console.error('Error in billing-summary:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
}

module.exports = {
    recordUsage,
    getCurrentUsage,
    getBillingSummary,
};