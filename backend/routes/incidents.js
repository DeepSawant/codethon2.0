const express = require('express');
const router = express.Router();
const Incident = require('../models/Incident');
const auth = require('../middleware/auth');
const upload = require('../middleware/upload');

// Get all incidents
router.get('/', async (req, res) => {
    try {
        const incidents = await Incident.find().sort({ createdAt: -1 });
        res.json(incidents);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

// Report an incident (Public)
router.post('/', upload.single('image'), async (req, res) => {
    try {
        const { type, severity, description, lat, lng } = req.body;

        const newIncident = new Incident({
            type,
            severity,
            description,
            location: { lat, lng },
            image: req.file ? `/uploads/${req.file.filename}` : ''
        });

        const incident = await newIncident.save();
        res.json(incident);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

// Update Incident Status (Auth required - Volunteer/Authority)
router.put('/:id', auth, async (req, res) => {
    try {
        const { status } = req.body;
        // Check permissions logic here (omitted for MVP speed)

        // If status is "Verified", mark verifiedBy
        let updateData = { status };
        if (status === 'Verified') {
            updateData.verifiedBy = req.user.userId;
        }

        const incident = await Incident.findByIdAndUpdate(req.params.id, updateData, { new: true });
        res.json(incident);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

// Delete Incident (Authority only)
router.delete('/:id', auth, async (req, res) => {
    try {
        if (req.user.role !== 'authority') return res.status(403).json({ msg: 'Not authorized' });

        await Incident.findByIdAndDelete(req.params.id);
        res.json({ msg: 'Incident removed' });
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

module.exports = router;
