// const express = require('express');
// const cors = require('cors');
// const dotenv = require('dotenv');
// const connectDB = require('./config/db');

// // Load env vars
// dotenv.config();
// // Connect to database (non-blocking)
// connectDB().catch(err => {
//     console.error('Database connection failed:', err.message);
// });

// const app = express();
// // IMPORTANT: Update CORS for production
// const allowedOrigins = [
//     'http://localhost:3000',
//     'https://your-frontend-app.vercel.app', // We'll update this later
// ];

// // Middleware
// app.use(cors({
//     origin: function (origin, callback) {
//         if (!origin || allowedOrigins.includes(origin)) {
//             callback(null, true);
//         } else {
//             callback(new Error('Not allowed by CORS'));
//         }
//     },
//     credentials: true
// }));
// app.use(express.json());
// app.use(express.urlencoded({ extended: false }));

// // Routes
// app.use('/api/auth', require('./routes/auth'));
// app.use('/api/transactions', require('./routes/transaction'));

// // Health check
// app.get('/api/health', (req, res) => {
//     res.json({ status: 'OK', message: 'Server is running' });
// });
// app.get("/", (req, res) => {
//     res.send("Expense Tracker backend is running");
// });
// // Error handling middleware
// app.use((err, req, res, next) => {
//     console.error(err.stack);
//     res.status(500).json({ message: 'Something went wrong!' });
// });

// module.exports = app;

const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

// Load environment variables
dotenv.config();

// Connect to database
connectDB();

const app = express();

// ============================================
// CORS Configuration - IMPORTANT!
// ============================================
const allowedOrigins = [
    'http://localhost:3000',           // Local development
    'http://localhost:5000',           // Local backend
    process.env.FRONTEND_URL,          // Production frontend (from env)
].filter(Boolean); // Remove undefined values

app.use(cors({
    origin: function (origin, callback) {
        // Allow requests with no origin (mobile apps, Postman, Vercel, etc.)
        if (!origin) return callback(null, true);

        // In development or if no specific frontend URL set, allow all origins
        if (process.env.NODE_ENV !== 'production' || !process.env.FRONTEND_URL) {
            return callback(null, true);
        }

        // In production with FRONTEND_URL set, check against whitelist
        if (allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(null, true); // Temporarily allow all for debugging
        }
    },
    credentials: true
}));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/transactions', require('./routes/transaction'));

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', message: 'Server is running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Something went wrong!' });
});

// Export app for Vercel
module.exports = app;

// Only listen if running locally
if (require.main === module) {
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}