import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { Icon } from 'leaflet';
import { Plus, AlertTriangle } from 'lucide-react';
import api from '../utils/api';
import IncidentForm from '../components/IncidentForm';
import Navbar from '../components/Navbar';

// Fix for default Leaflet marker icons in React
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = new Icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});
import L from 'leaflet';
L.Marker.prototype.options.icon = DefaultIcon;

// Sub-component to handle map flyTo when location changes
const MapRecenter = ({ lat, lng }) => {
    const map = useMap();
    useEffect(() => {
        map.flyTo([lat, lng], 13);
    }, [lat, lng, map]);
    return null;
};

const Home = () => {
    const [center, setCenter] = useState([20.5937, 78.9629]); // Default India
    const [incidents, setIncidents] = useState([]);
    const [showReportForm, setShowReportForm] = useState(false);
    const [userLocation, setUserLocation] = useState(null);

    const fetchIncidents = async () => {
        try {
            const res = await api.get('/incidents');
            setIncidents(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchIncidents();
        const interval = setInterval(fetchIncidents, 10000);

        navigator.geolocation.getCurrentPosition(pos => {
            const { latitude, longitude } = pos.coords;
            setUserLocation({ lat: latitude, lng: longitude });
            // Only update center if we haven't moved manually? 
            // For now, let's just initial center.
            setCenter([latitude, longitude]);
        });

        return () => clearInterval(interval);
    }, []);

    // Custom Icons based on status
    const getMarkerIcon = (status) => {
        let colorUrl = 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png'; // Red Default
        if (status === 'Verified') colorUrl = 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-orange.png';
        if (status === 'In Action') colorUrl = 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png';
        if (status === 'Resolved') colorUrl = 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png';

        return new Icon({
            iconUrl: colorUrl,
            shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
            iconSize: [25, 41],
            iconAnchor: [12, 41],
            popupAnchor: [1, -34],
            shadowSize: [41, 41]
        });
    };

    return (
        <div className="map-container">
            <Navbar />

            <MapContainer center={center} zoom={5} style={{ height: '100%', width: '100%', zIndex: 1 }}>
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />

                {userLocation && <MapRecenter lat={userLocation.lat} lng={userLocation.lng} />}

                {/* User Location Marker */}
                {userLocation && (
                    <Marker position={[userLocation.lat, userLocation.lng]} icon={new Icon({
                        iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-violet.png',
                        iconSize: [25, 41],
                        iconAnchor: [12, 41]
                    })}>
                        <Popup>You are here</Popup>
                    </Marker>
                )}

                {incidents.map(incident => (
                    <Marker
                        key={incident._id}
                        position={[incident.location.lat, incident.location.lng]}
                        icon={getMarkerIcon(incident.status)}
                    >
                        <Popup>
                            <div className="popup-card">
                                <h3 style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 5 }}>
                                    {incident.type}
                                    <span style={{ fontSize: '0.7rem', padding: '2px 6px', borderRadius: 4, background: '#eee', color: '#333' }}>
                                        {incident.status}
                                    </span>
                                </h3>
                                <div style={{ fontSize: '0.8rem', marginBottom: 5 }}>Severity: <b>{incident.severity}</b></div>
                                <div>{incident.description}</div>
                                {incident.image && (
                                    <img src={`${import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5001'}${incident.image}`} alt="Evidence" style={{ width: '100%', marginTop: 5, borderRadius: 4 }} />
                                )}
                                <div style={{ fontSize: '0.7rem', color: '#666', marginTop: 5 }}>
                                    {new Date(incident.createdAt).toLocaleString()}
                                </div>
                            </div>
                        </Popup>
                    </Marker>
                ))}
            </MapContainer>

            <button className="report-fab" onClick={() => setShowReportForm(true)} style={{ zIndex: 1000 }}>
                <Plus size={32} />
            </button>

            {showReportForm && (
                <div style={{ zIndex: 2000, position: 'relative' }}>
                    <IncidentForm
                        onClose={() => setShowReportForm(false)}
                        onSuccess={() => {
                            setShowReportForm(false);
                            fetchIncidents();
                        }}
                        currentLoc={userLocation || { lat: center[0], lng: center[1] }}
                    />
                </div>
            )}
        </div>
    );
};

export default Home;
