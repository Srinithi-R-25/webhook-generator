const mongoose = require('mongoose');

const webhookSchema = new mongoose.Schema({
  shopifyStore: { type: String, required: true },
  freshmarketerApiKey: { type: String, required: true },
  webhookUrl: { type: String, required: true }
});

module.exports = mongoose.model('Webhook', webhookSchema);
