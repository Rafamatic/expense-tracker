import React from 'react';
import './Statistics.css';

function Statistics({ stats }) {
    const formatAmount = (amount) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(amount);
    };

    return (
        <div className="statistics">
            <div className="stat-card balance">
                <div className="stat-icon">💰</div>
                <div className="stat-info">
                    <div className="stat-label">Total Balance</div>
                    <div className="stat-value">{formatAmount(stats.balance)}</div>
                </div>
            </div>

            <div className="stat-card income">
                <div className="stat-icon">📈</div>
                <div className="stat-info">
                    <div className="stat-label">Total Income</div>
                    <div className="stat-value income-color">
                        +{formatAmount(stats.totalIncome)}
                    </div>
                </div>
            </div>

            <div className="stat-card expense">
                <div className="stat-icon">📉</div>
                <div className="stat-info">
                    <div className="stat-label">Total Expense</div>
                    <div className="stat-value expense-color">
                        -{formatAmount(stats.totalExpense)}
                    </div>
                </div>
            </div>

            <div className="stat-card count">
                <div className="stat-icon">📊</div>
                <div className="stat-info">
                    <div className="stat-label">Transactions</div>
                    <div className="stat-value">{stats.transactionCount}</div>
                </div>
            </div>
        </div>
    );
}

export default Statistics;