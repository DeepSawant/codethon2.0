const mongoose = require('mongoose');
require('dotenv').config();

console.log('Attempting to connect...');
console.log('URI length:', process.env.MONGO_URI ? process.env.MONGO_URI.length : 0);

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('SUCCESS: Connected!'))
    .catch(err => {
        console.log('--- ERROR DETAILS ---');
        console.log('NAME:', err.name);
        console.log('CODE:', err.code);
        console.log('MESSAGE:', err.message);
        console.log('---------------------');
        process.exit(1);
    });
