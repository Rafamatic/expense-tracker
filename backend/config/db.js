const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        if (!process.env.MONGODB_URI) {
            console.error('MongoDB Connection Error: MONGODB_URI is not defined in .env file');
            console.error('Please create a .env file with MONGODB_URI=your_connection_string');
            return;
        }
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('MongoDB Connected Successfully');
    } catch (error) {
        console.error('MongoDB Connection Error:', error.message);
        console.error('Server will continue to run, but database operations will fail');
    }
};

module.exports = connectDB;