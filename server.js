const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const usageController = require('./controllers/usageController');
app.use(express.json());

const userRoutes = require('./routes/userRoutes');
const planRoutes = require('./routes/planRoutes');
const subscriptionRoutes = require('./routes/subscriptionRoutes');
const usageRoutes = require('./routes/usageRoutes');

app.use('/users', userRoutes);
app.use('/plans', planRoutes);
app.use('/subscriptions', subscriptionRoutes);
app.use('/usage', usageRoutes);

app.get('/users/:id/current-usage', usageController.getCurrentUsage);
app.get('/users/:id/billing-summary', usageController.getBillingSummary);

app.get('/', (req, res) => {
    res.send('Subscription Billing API is running. Use /users, /plans, /subscriptions, /usage');
});

app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
});