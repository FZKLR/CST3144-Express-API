const { dbReady } = require('../config/db');
const AppError = require('../middleware/appError');

/**
 * POST /orders
 * Saves a new order to the order collection.
 */
exports.createOrder = async (req, res, next) => {
    try {
        const db = dbReady();
        const newOrder = req.body;
        const result = await db.collection('order').insertOne(newOrder);
        res.status(201).json({ message: 'Order saved successfully', result });
    } catch (err) {
        next(new AppError('Error saving order', 500));
    }
};