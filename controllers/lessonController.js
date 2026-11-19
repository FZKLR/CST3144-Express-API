const { ObjectId } = require('mongodb');
const { dbReady } = require('../config/db');
const AppError = require('../middleware/appError');

/**
 * GET /lessons
 * Fetches all lessons (with optional query filtering).
 */
exports.getLessons = async (req, res, next) => {
    try {
        const db = dbReady();
        const { category, search } = req.query;

        const query = {};

        if (category) {
            query.category = category;
        }

        if (search) {
            const regex = new RegExp(search, 'i');
            query.$or = [
                { topic: regex },
                { title: regex },
                { location: regex }
            ];
        }

        const lessons = await db.collection('lesson').find(query).toArray();
        res.json(lessons);
    } catch (err) {
        next(new AppError('Error fetching lessons', 500));
    }
};

/**
 * PUT /lessons/:id
 * Updates any attribute(s) of a specific lesson by ObjectId.
 */
exports.updateLesson = async (req, res, next) => {
    try {
        const db = dbReady();
        const { id } = req.params;

        if (!ObjectId.isValid(id)) {
            return next(new AppError('Invalid lesson ID format', 400));
        }

        const updateData = req.body;
        const result = await db.collection('lesson').updateOne(
            { _id: new ObjectId(id) },
            { $set: updateData }
        );

        if (result.matchedCount === 0) {
            return next(new AppError('Lesson not found', 404));
        }

        res.json({ message: 'Lesson updated successfully', result });
    } catch (err) {
        next(new AppError('Error updating lesson', 500));
    }
};