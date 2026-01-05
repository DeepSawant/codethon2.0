import { useState, useEffect } from 'react';
import api from '../utils/api';
import { Camera, MapPin, X } from 'lucide-react';

const IncidentForm = ({ onClose, onSuccess, currentLoc }) => {
    const [formData, setFormData] = useState({
        type: 'Accident',
        severity: 'Medium',
        description: '',
        lat: currentLoc?.lat || 0,
        lng: currentLoc?.lng || 0,
    });
    const [image, setImage] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const data = new FormData();
            Object.keys(formData).forEach(key => data.append(key, formData[key]));
            if (image) data.append('image', image);

            await api.post('/incidents', data, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            onSuccess();
        } catch (err) {
            console.error(err);
            alert('Failed to report incident');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content glass" style={{ padding: '2rem' }}>
                <button onClick={onClose} style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'transparent', color: 'white' }}>
                    <X />
                </button>
                <h2>Report Incident</h2>
                <form onSubmit={handleSubmit} className="auth-form" style={{ padding: '1rem 0' }}>
                    <div className="input-group">
                        <label>Location</label>
                        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', fontSize: '0.8rem', opacity: 0.7 }}>
                            <MapPin size={16} />
                            {formData.lat.toFixed(4)}, {formData.lng.toFixed(4)}
                        </div>
                    </div>

                    <div className="input-group">
                        <select
                            value={formData.type}
                            onChange={e => setFormData({ ...formData, type: e.target.value })}
                        >
                            <option>Accident</option>
                            <option>Fire</option>
                            <option>Flood</option>
                            <option>Medical</option>
                            <option>Crime</option>
                            <option>Other</option>
                        </select>
                    </div>

                    <div className="input-group">
                        <select
                            value={formData.severity}
                            onChange={e => setFormData({ ...formData, severity: e.target.value })}
                        >
                            <option>Low</option>
                            <option>Medium</option>
                            <option>High</option>
                            <option>Critical</option>
                        </select>
                    </div>

                    <div className="input-group">
                        <textarea
                            placeholder="Describe the situation..."
                            value={formData.description}
                            onChange={e => setFormData({ ...formData, description: e.target.value })}
                            required
                        />
                    </div>

                    <div className="input-group">
                        <label className="btn" style={{ background: 'rgba(255,255,255,0.1)', width: '100%' }}>
                            <Camera size={18} /> Upload Evidence
                            <input
                                type="file"
                                accept="image/*"
                                onChange={e => setImage(e.target.files[0])}
                                style={{ display: 'none' }}
                            />
                        </label>
                        {image && <p style={{ fontSize: '0.8rem', marginTop: '0.5rem' }}>Selected: {image.name}</p>}
                    </div>

                    <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={loading}>
                        {loading ? 'Submitting...' : 'Submit Report'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default IncidentForm;
