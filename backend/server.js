require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dns = require('dns');
const authRoutes = require('./routes/auth');
const incidentRoutes = require('./routes/incidents');

// Fix for Node 17+ and MongoDB Atlas DNS issues
if (dns.setDefaultResultOrder) {
    dns.setDefaultResultOrder('ipv4first');
}

const app = express();

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads')); // For serving images

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/incidents', incidentRoutes);

// Database Connection (In-Memory Fallback)
const { MongoMemoryServer } = require('mongodb-memory-server');

const connectDB = async () => {
    try {
        let mongoUri = process.env.MONGO_URI;

        // Check if we should use In-Memory (if URI is invalid or user requested)
        // For this recovery, we enforce In-Memory if the env var fails, but let's just force it now as requested
        console.log('Starting In-Memory MongoDB...');
        const mongod = await MongoMemoryServer.create();
        mongoUri = mongod.getUri();
        console.log(`In-Memory MongoDB running at: ${mongoUri}`);

        mongoose.set('strictQuery', false);
        await mongoose.connect(mongoUri);
        console.log('MongoDB Connected (In-Memory)');
    } catch (err) {
        console.error('MongoDB Connection Error:', err);
        process.exit(1);
    }
};

connectDB();


const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
