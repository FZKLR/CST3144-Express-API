const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const { connectDB } = require('./config/db');
const lessonController = require('./controllers/lessonController');
const orderController = require('./controllers/orderController');
const { schemas, validate } = require('./middleware/validation');
const globalErrorHandler = require('./middleware/errorMiddleware');

const app = express();

// Standard middleware
app.use(express.json());
app.use(cors());

// Required Logger Middleware
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} request to ${req.url}`);
    next();
});

// Required Static File Middleware
app.use('/images', (req, res) => {
    const filePath = path.join(__dirname, 'images', req.url);
    fs.access(filePath, fs.constants.F_OK, (err) => {
        if (err) {
            res.status(404).send('Image file does not exist');
        } else {
            res.sendFile(filePath);
        }
    });
});

// Validation middleware wrapper
const validateRequest = (schema) => {
    return (req, res, next) => {
        const { error, value } = validate(schema, req.body);
        if (error) {
            return res.status(400).json({
                message: 'Validation Error',
                errors: error.details.map((err) => err.message)
            });
        }
        req.body = value;
        next();
    };
};

app.get('/search', (req, res, next) => {
    const q = String(req.query.q || '').trim();

    if (!q) {
        return req.collection.find({}).toArray()
        .then((results) => res.json(results))
        .catch(next);
    }

    // Escape regex special characters so inputs like "+" or "(" don't break RegExp
    const escaped = q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(escaped, 'i');

    const query = {
        $or: [
        { topic: regex },
        { subject: regex },
        { location: regex },
        { $expr: { $regexMatch: { input: { $toString: '$price' }, regex: escaped, options: 'i' } } },
        { $expr: { $regexMatch: { input: { $toString: '$space' }, regex: escaped, options: 'i' } } }
        ]
    };

    req.collection.find(query).toArray()
        .then((results) => res.json(results))
        .catch(next);
});
// REST API Routes
app.get('/lessons', lessonController.getLessons);
app.post('/orders', validateRequest(schemas.order_create), orderController.createOrder);
app.put('/lessons/:id', validateRequest(schemas.lesson_update), lessonController.updateLesson);

// Global Error Handler Middleware
app.use(globalErrorHandler);

// Start the server after connecting to MongoDB
const PORT = process.env.PORT || 3000;
const startServer = async () => {
    await connectDB();
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
};

startServer();