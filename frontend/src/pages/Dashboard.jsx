import { useState, useEffect, useContext } from 'react';
import api from '../utils/api';
import Navbar from '../components/Navbar';
import { AuthContext } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';
import { Check, X, Shield, Play } from 'lucide-react';

const Dashboard = () => {
    const { user, loading } = useContext(AuthContext);
    const [incidents, setIncidents] = useState([]);

    const fetchIncidents = async () => {
        try {
            const res = await api.get('/incidents');
            setIncidents(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        if (user) fetchIncidents();
    }, [user]);

    const updateStatus = async (id, status) => {
        try {
            await api.put(`/incidents/${id}`, { status });
            fetchIncidents();
        } catch (err) {
            alert('Update failed');
        }
    };

    const deleteIncident = async (id) => {
        if (!confirm('Are you sure?')) return;
        try {
            await api.delete(`/incidents/${id}`);
            fetchIncidents();
        } catch (err) {
            alert('Delete failed');
        }
    };

    if (loading) return <div>Loading...</div>;
    if (!user || user.role === 'user') return <Navigate to="/" />;

    return (
        <div className="app-container">
            <Navbar />
            <div className="dashboard-container">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                    <h1>{user.role === 'authority' ? 'Authority Control Center' : 'Volunteer Dashboard'}</h1>
                    <button className="btn btn-secondary" onClick={fetchIncidents}>Refresh Data</button>
                </div>

                <div className="dashboard-stats glass">
                    <div className="stat-card">
                        <h3>Total Incidents</h3>
                        <div className="stat-value">{incidents.length}</div>
                    </div>
                    <div className="stat-card">
                        <h3>Unverified</h3>
                        <div className="stat-value">{incidents.filter(i => i.status === 'Unverified').length}</div>
                    </div>
                    <div className="stat-card">
                        <h3>Active Action</h3>
                        <div className="stat-value">{incidents.filter(i => i.status === 'In Action').length}</div>
                    </div>
                </div>

                <div className="glass table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>Type</th>
                                <th>Severity</th>
                                <th>Status</th>
                                <th>Description</th>
                                <th>Location</th>
                                <th>Reported</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {incidents.map(incident => (
                                <tr key={incident._id}>
                                    <td><strong>{incident.type}</strong></td>
                                    <td>
                                        <span style={{
                                            color: incident.severity === 'Critical' ? '#ef4444' :
                                                incident.severity === 'High' ? '#f59e0b' : 'white'
                                        }}>
                                            {incident.severity}
                                        </span>
                                    </td>
                                    <td><span className={`status-badge status-${incident.status.split(' ')[0]}`}>{incident.status}</span></td>
                                    <td>{incident.description.substring(0, 50)}...</td>
                                    <td>{incident.location.lat.toFixed(4)}, {incident.location.lng.toFixed(4)}</td>
                                    <td>{new Date(incident.createdAt).toLocaleDateString()}</td>
                                    <td>
                                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                                            {/* Verification Button */}
                                            {incident.status === 'Unverified' && (
                                                <button
                                                    className="btn btn-secondary"
                                                    style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem' }}
                                                    onClick={() => updateStatus(incident._id, 'Verified')}
                                                    title="Verify"
                                                >
                                                    <Check size={14} /> Verify
                                                </button>
                                            )}

                                            {/* Authority Actions */}
                                            {user.role === 'authority' && (
                                                <>
                                                    {incident.status !== 'Resolved' && incident.status !== 'In Action' && (
                                                        <button
                                                            className="btn btn-primary"
                                                            style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem', backgroundColor: '#3b82f6' }}
                                                            onClick={() => updateStatus(incident._id, 'In Action')}
                                                            title="Dispatch Resources"
                                                        >
                                                            <Play size={14} /> Action
                                                        </button>
                                                    )}
                                                    {incident.status !== 'Resolved' && (
                                                        <button
                                                            className="btn btn-primary"
                                                            style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem', backgroundColor: '#10b981' }}
                                                            onClick={() => updateStatus(incident._id, 'Resolved')}
                                                            title="Mark Resolved"
                                                        >
                                                            <Shield size={14} /> Resolve
                                                        </button>
                                                    )}
                                                    <button
                                                        className="btn"
                                                        style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem', background: 'rgba(255,0,0,0.2)' }}
                                                        onClick={() => deleteIncident(incident._id)}
                                                        title="Delete/Fake"
                                                    >
                                                        <X size={14} />
                                                    </button>
                                                </>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
