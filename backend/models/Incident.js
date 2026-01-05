const mongoose = require('mongoose');

const IncidentSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Optional logic for anon users
    type: { type: String, required: true },
    severity: { type: String, required: true },
    description: String,
    image: String, // URL/path
    location: {
        lat: { type: Number, required: true },
        lng: { type: Number, required: true }
    },
    status: {
        type: String,
        enum: ['Unverified', 'Verified', 'In Action', 'Resolved'],
        default: 'Unverified'
    },
    verifiedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    upvotes: { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model('Incident', IncidentSchema);
