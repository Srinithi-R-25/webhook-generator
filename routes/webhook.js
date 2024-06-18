const express = require('express');
const router = express.Router();
const { MongoClient } = require('mongodb');

// MongoDB connection URI
const uri = 'mongodb://localhost:27017/webhook';
const dbName = 'webhooksDB';

let db;

// Connect to MongoDB
MongoClient.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(client => {
        console.log('Connected to Database');
        db = client.db(dbName);
    })
    .catch(error => console.error(error));

// Endpoint to generate webhook URL
router.post('/generate-webhook', (req, res) => {
    const { shopifyStore, freshmarketerApiKey } = req.body;

    if (!shopifyStore || !freshmarketerApiKey) {
        return res.status(400).json({ error: 'Missing required fields: Shopify Store and Freshmarketer API key' });
    }

    const webhookUrl = `https://yourapp.com/webhook?shopifyStore=${encodeURIComponent(shopifyStore)}&freshmarketerApiKey=${encodeURIComponent(freshmarketerApiKey)}`;

    // Save webhook data to MongoDB
    const collection = db.collection('webhooks');
    collection.insertOne({ shopifyStore, freshmarketerApiKey, webhookUrl })
        .then(result => {
            res.json({ webhookUrl });
        })
        .catch(error => {
            res.status(500).json({ error: 'Failed to save webhook data' });
        });
});

// Endpoint to handle webhook events
router.post('/webhook', (req, res) => {
    console.log('Webhook event received:', req.body);

    // Save webhook event data to MongoDB
    const collection = db.collection('webhookEvents');
    collection.insertOne(req.body)
        .then(result => {
            res.status(200).send('Webhook event received');
        })
        .catch(error => {
            res.status(500).send('Failed to save webhook event');
        });
});

module.exports = router;
