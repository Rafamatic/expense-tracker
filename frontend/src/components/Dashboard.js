import React, { useState, useEffect } from 'react';
import TransactionForm from './TransactionForm';
import TransactionList from './TransactionList';
import Statistics from './Statistics';
import { transactionAPI } from '../api';
import './Dashboard.css';

function Dashboard({ user, onLogout }) {
    const [transactions, setTransactions] = useState([]);
    const [stats, setStats] = useState({
        totalIncome: 0,
        totalExpense: 0,
        balance: 0,
        transactionCount: 0
    });
    const [filters, setFilters] = useState({
        category: '',
        type: '',
        startDate: '',
        endDate: ''
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchTransactions();
        fetchStats();
    }, [filters]);

    const fetchTransactions = async () => {
        try {
            setLoading(true);
            const response = await transactionAPI.getAll(filters);
            setTransactions(response.data);
            setError('');
        } catch (err) {
            setError('Failed to fetch transactions');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const fetchStats = async () => {
        try {
            const response = await transactionAPI.getStats();
            setStats(response.data);
        } catch (err) {
            console.error('Failed to fetch stats:', err);
        }
    };

    const handleAddTransaction = async (transaction) => {
        try {
            await transactionAPI.create(transaction);
            fetchTransactions();
            fetchStats();
            return true;
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to add transaction');
            return false;
        }
    };

    const handleDeleteTransaction = async (id) => {
        if (window.confirm('Are you sure you want to delete this transaction?')) {
            try {
                await transactionAPI.delete(id);
                fetchTransactions();
                fetchStats();
            } catch (err) {
                setError('Failed to delete transaction');
                console.error(err);
            }
        }
    };

    const handleFilterChange = (e) => {
        setFilters({
            ...filters,
            [e.target.name]: e.target.value
        });
    };

    const clearFilters = () => {
        setFilters({
            category: '',
            type: '',
            startDate: '',
            endDate: ''
        });
    };

    return (
        <div className="dashboard">
            <header className="dashboard-header">
                <div className="header-content">
                    <div>
                        <h1>💰 ExpenseTracker</h1>
                        <p>Welcome back, {user.name}!</p>
                    </div>
                    <button onClick={onLogout} className="logout-btn">
                        Logout
                    </button>
                </div>
            </header>

            <div className="dashboard-container">
                <Statistics stats={stats} />

                <div className="dashboard-grid">
                    <div className="form-section">
                        <TransactionForm onAdd={handleAddTransaction} />
                    </div>

                    <div className="list-section">
                        <div className="filters-section">
                            <h3>Filter Transactions</h3>
                            <div className="filters-grid">
                                <select name="type" value={filters.type} onChange={handleFilterChange}>
                                    <option value="">All Types</option>
                                    <option value="income">Income</option>
                                    <option value="expense">Expense</option>
                                </select>

                                <input
                                    type="text"
                                    name="category"
                                    placeholder="Filter by category"
                                    value={filters.category}
                                    onChange={handleFilterChange}
                                />

                                <input
                                    type="date"
                                    name="startDate"
                                    value={filters.startDate}
                                    onChange={handleFilterChange}
                                />

                                <input
                                    type="date"
                                    name="endDate"
                                    value={filters.endDate}
                                    onChange={handleFilterChange}
                                />

                                <button onClick={clearFilters} className="clear-btn">
                                    Clear Filters
                                </button>
                            </div>
                        </div>

                        {error && <div className="error-banner">{error}</div>}

                        <TransactionList
                            transactions={transactions}
                            onDelete={handleDeleteTransaction}
                            loading={loading}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Dashboard;