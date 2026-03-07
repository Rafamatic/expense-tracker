import React, { useState } from 'react';
import './TransactionForm.css';

const CATEGORIES = {
    income: ['Salary', 'Freelance', 'Investment', 'Gift', 'Other Income'],
    expense: ['Food', 'Transport', 'Shopping', 'Entertainment', 'Bills', 'Healthcare', 'Education', 'Other Expense']
};

function TransactionForm({ onAdd }) {
    const [formData, setFormData] = useState({
        type: 'expense',
        category: 'Food',
        amount: '',
        description: '',
        date: new Date().toISOString().split('T')[0]
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name === 'type') {
            setFormData({
                ...formData,
                [name]: value,
                category: CATEGORIES[value][0]
            });
        } else {
            setFormData({
                ...formData,
                [name]: value
            });
        }
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.amount || parseFloat(formData.amount) <= 0) {
            setError('Please enter a valid amount');
            return;
        }

        if (!formData.description.trim()) {
            setError('Please enter a description');
            return;
        }

        setLoading(true);
        const success = await onAdd({
            ...formData,
            amount: parseFloat(formData.amount)
        });

        if (success) {
            setFormData({
                type: 'expense',
                category: 'Food',
                amount: '',
                description: '',
                date: new Date().toISOString().split('T')[0]
            });
        }
        setLoading(false);
    };

    return (
        <div className="transaction-form">
            <h2>Add Transaction</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Type</label>
                    <div className="type-selector">
                        <button
                            type="button"
                            className={formData.type === 'income' ? 'active income' : 'income'}
                            onClick={() => handleChange({ target: { name: 'type', value: 'income' } })}
                        >
                            + Income
                        </button>
                        <button
                            type="button"
                            className={formData.type === 'expense' ? 'active expense' : 'expense'}
                            onClick={() => handleChange({ target: { name: 'type', value: 'expense' } })}
                        >
                            - Expense
                        </button>
                    </div>
                </div>

                <div className="form-group">
                    <label>Category</label>
                    <select
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                        required
                    >
                        {CATEGORIES[formData.type].map(cat => (
                            <option key={cat} value={cat}>{cat}</option>
                        ))}
                    </select>
                </div>

                <div className="form-group">
                    <label>Amount</label>
                    <input
                        type="number"
                        name="amount"
                        value={formData.amount}
                        onChange={handleChange}
                        placeholder="0.00"
                        step="0.01"
                        min="0.01"
                        required
                    />
                </div>

                <div className="form-group">
                    <label>Description</label>
                    <input
                        type="text"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        placeholder="Enter description"
                        maxLength="200"
                        required
                    />
                </div>

                <div className="form-group">
                    <label>Date</label>
                    <input
                        type="date"
                        name="date"
                        value={formData.date}
                        onChange={handleChange}
                        required
                    />
                </div>

                {error && <div className="form-error">{error}</div>}

                <button type="submit" className="submit-transaction-btn" disabled={loading}>
                    {loading ? 'Adding...' : 'Add Transaction'}
                </button>
            </form>
        </div>
    );
}

export default TransactionForm;