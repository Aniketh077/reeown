const mongoose = require('mongoose');

const stockNotificationSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please add a valid email']
  },
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  notified: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  notifiedAt: {
    type: Date
  }
});

stockNotificationSchema.index({ product: 1, email: 1 }, { unique: true });

module.exports = mongoose.model('StockNotification', stockNotificationSchema);
