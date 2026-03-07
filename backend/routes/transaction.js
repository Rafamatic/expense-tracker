const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const Transaction = require('../models/Transaction');
const { protect } = require('../middleware/auth');

// All routes are protected
router.use(protect);

// @route   GET /api/transactions
// @desc    Get all transactions for logged-in user
// @access  Private
router.get('/', async (req, res) => {
    try {
        const { category, startDate, endDate, type } = req.query;

        // Build query
        let query = { user: req.user._id };

        if (category) {
            query.category = category;
        }

        if (type) {
            query.type = type;
        }

        if (startDate || endDate) {
            query.date = {};
            if (startDate) {
                query.date.$gte = new Date(startDate);
            }
            if (endDate) {
                query.date.$lte = new Date(endDate);
            }
        }

        const transactions = await Transaction.find(query).sort({ date: -1 });

        res.json(transactions);
    } catch (error) {
        console.error('Get transactions error:', error.message);
        res.status(500).json({ message: 'Server error fetching transactions' });
    }
});

// @route   GET /api/transactions/stats
// @desc    Get transaction statistics
// @access  Private
router.get('/stats', async (req, res) => {
    try {
        const stats = await Transaction.aggregate([
            { $match: { user: req.user._id } },
            {
                $group: {
                    _id: '$type',
                    total: { $sum: '$amount' },
                    count: { $sum: 1 }
                }
            }
        ]);

        const result = {
            totalIncome: 0,
            totalExpense: 0,
            balance: 0,
            transactionCount: 0
        };

        stats.forEach(stat => {
            if (stat._id === 'income') {
                result.totalIncome = stat.total;
            } else if (stat._id === 'expense') {
                result.totalExpense = stat.total;
            }
            result.transactionCount += stat.count;
        });

        result.balance = result.totalIncome - result.totalExpense;

        res.json(result);
    } catch (error) {
        console.error('Get stats error:', error.message);
        res.status(500).json({ message: 'Server error fetching statistics' });
    }
});

// @route   POST /api/transactions
// @desc    Create a new transaction
// @access  Private
router.post('/', [
    body('type').isIn(['income', 'expense']).withMessage('Type must be income or expense'),
    body('category').trim().notEmpty().withMessage('Category is required'),
    body('amount').isFloat({ min: 0.01 }).withMessage('Amount must be greater than 0'),
    body('description').trim().notEmpty().isLength({ max: 200 }).withMessage('Description is required and max 200 characters'),
    body('date').optional().isISO8601().withMessage('Invalid date format')
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const { type, category, amount, description, date } = req.body;

        const transaction = await Transaction.create({
            user: req.user._id,
            type,
            category,
            amount,
            description,
            date: date || Date.now()
        });

        res.status(201).json(transaction);
    } catch (error) {
        console.error('Create transaction error:', error.message);
        res.status(500).json({ message: 'Server error creating transaction' });
    }
});

// @route   PUT /api/transactions/:id
// @desc    Update a transaction
// @access  Private
router.put('/:id', [
    body('type').optional().isIn(['income', 'expense']).withMessage('Type must be income or expense'),
    body('category').optional().trim().notEmpty().withMessage('Category cannot be empty'),
    body('amount').optional().isFloat({ min: 0.01 }).withMessage('Amount must be greater than 0'),
    body('description').optional().trim().notEmpty().isLength({ max: 200 }).withMessage('Description max 200 characters'),
    body('date').optional().isISO8601().withMessage('Invalid date format')
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        let transaction = await Transaction.findById(req.params.id);

        if (!transaction) {
            return res.status(404).json({ message: 'Transaction not found' });
        }

        // Make sure user owns transaction
        if (transaction.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized to update this transaction' });
        }

        transaction = await Transaction.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        res.json(transaction);
    } catch (error) {
        console.error('Update transaction error:', error.message);
        res.status(500).json({ message: 'Server error updating transaction' });
    }
});

// @route   DELETE /api/transactions/:id
// @desc    Delete a transaction
// @access  Private
router.delete('/:id', async (req, res) => {
    try {
        const transaction = await Transaction.findById(req.params.id);

        if (!transaction) {
            return res.status(404).json({ message: 'Transaction not found' });
        }

        // Make sure user owns transaction
        if (transaction.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized to delete this transaction' });
        }

        await Transaction.findByIdAndDelete(req.params.id);

        res.json({ message: 'Transaction deleted successfully' });
    } catch (error) {
        console.error('Delete transaction error:', error.message);
        res.status(500).json({ message: 'Server error deleting transaction' });
    }
});

module.exports = router;