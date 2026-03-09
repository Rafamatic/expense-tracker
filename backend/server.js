const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

dotenv.config();

const app = express();

// Connect to database safely
connectDB().catch(err => {
    console.error('Database connection failed:', err.message);
});

// CORS
// app.use(cors({
//     origin: ['http://localhost:3000', 'https://expense-tracker-chi-lyart.vercel.app'],
//     credentials: true
// }));

const allowedOrigins = [
    'http://localhost:3000',
    'https://expense-tracker-frontend-ten-pi.vercel.app'
];

const corsOptions = {
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error(`CORS blocked for origin: ${origin}`));
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/api/auth', require('./routes/auth'));
app.use('/api/transactions', require('./routes/transaction'));

app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', message: 'Server is running' });
});

app.get('/', (req, res) => {
    res.json({
        message: 'ExpenseTracker API',
        endpoints: {
            health: '/api/health',
            register: '/api/auth/register',
            login: '/api/auth/login',
            transactions: '/api/transactions'
        }
    });
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: err.message || 'Something went wrong!' });
});

module.exports = app;