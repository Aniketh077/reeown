const StockNotification = require('../models/StockNotification');
const Product = require('../models/Product');
const EmailService = require('../emailService/EmailService');

exports.requestNotification = async (req, res) => {
  try {
    const { productId, email } = req.body;

    if (!productId || !email) {
      return res.status(400).json({ message: 'Product ID and email are required' });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    if (product.stock > 0) {
      return res.status(400).json({ message: 'Product is currently in stock' });
    }

    const existingNotification = await StockNotification.findOne({
      product: productId,
      email: email
    });

    if (existingNotification && !existingNotification.notified) {
      return res.status(200).json({
        success: true,
        message: 'You are already subscribed to notifications for this product',
        notification: existingNotification
      });
    }

    const notification = await StockNotification.create({
      email,
      product: productId
    });

    res.status(201).json({
      success: true,
      message: 'You will be notified when this product is back in stock',
      notification
    });
  } catch (error) {
    console.error('Request notification error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.notifyStockAvailable = async (productId) => {
  try {
    const notifications = await StockNotification.find({
      product: productId,
      notified: false
    });

    const product = await Product.findById(productId);
    let successCount = 0;
    let failedCount = 0;

    for (const notification of notifications) {
      try {
        await EmailService.sendStockNotification(
          notification.email,
          product.name,
          product._id
        );

        notification.notified = true;
        notification.notifiedAt = new Date();
        await notification.save();
        successCount++;
        console.log(`Email notification sent to ${notification.email}`);
      } catch (error) {
        console.error(`Failed to send notification to ${notification.email}:`, error);
        failedCount++;
      }
    }

    return {
      success: true,
      notifiedCount: successCount,
      failedCount: failedCount,
      totalRequests: notifications.length
    };
  } catch (error) {
    console.error('Notify stock available error:', error);
    return {
      success: false,
      error: error.message
    };
  }
};
