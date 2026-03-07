import React from 'react';
import './TransactionList.css';

function TransactionList({ transactions, onDelete, loading }) {
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const formatAmount = (amount) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(amount);
    };

    if (loading) {
        return (
            <div className="transaction-list">
                <h2>Transaction History</h2>
                <div className="loading">Loading transactions...</div>
            </div>
        );
    }

    return (
        <div className="transaction-list">
            <h2>Transaction History ({transactions.length})</h2>

            {transactions.length === 0 ? (
                <div className="empty-state">
                    <div className="empty-icon">📊</div>
                    <p>No transactions found</p>
                    <small>Start by adding your first transaction</small>
                </div>
            ) : (
                <div className="transactions-container">
                    {transactions.map(transaction => (
                        <div
                            key={transaction._id}
                            className={`transaction-item ${transaction.type}`}
                        >
                            <div className="transaction-info">
                                <div className="transaction-header">
                                    <span className="transaction-category">
                                        {transaction.category}
                                    </span>
                                    <span className="transaction-date">
                                        {formatDate(transaction.date)}
                                    </span>
                                </div>
                                <div className="transaction-description">
                                    {transaction.description}
                                </div>
                            </div>

                            <div className="transaction-actions">
                                <div className={`transaction-amount ${transaction.type}`}>
                                    {transaction.type === 'income' ? '+' : '-'}
                                    {formatAmount(transaction.amount)}
                                </div>
                                <button
                                    onClick={() => onDelete(transaction._id)}
                                    className="delete-btn"
                                    title="Delete transaction"
                                >
                                    🗑️
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default TransactionList;