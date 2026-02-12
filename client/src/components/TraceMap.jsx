import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icons in Leaflet with React
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: markerIcon,
    shadowUrl: markerShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

// Custom Gold Icon for Trace Nodes
const goldIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-gold.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

const TraceMap = ({ history }) => {
    // Filter out history entries without coordinates
    const geoPoints = history
        .filter(event => event.coordinates && event.coordinates.lat && event.coordinates.lng)
        .map(event => ({
            position: [event.coordinates.lat, event.coordinates.lng],
            stage: event.stage,
            location: event.location,
            owner: event.owner,
            timestamp: event.timestamp
        }));

    if (geoPoints.length === 0) return null;

    // Center map on the latest point
    const center = geoPoints[geoPoints.length - 1].position;

    // Create line coordinates
    const polyline = geoPoints.map(p => p.position);

    return (
        <div className="h-[400px] w-full rounded-[2.5rem] overflow-hidden border border-[#d4af37]/20 shadow-2xl relative z-0">
            <MapContainer
                center={center}
                zoom={6}
                scrollWheelZoom={false}
                className="h-full w-full"
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                    url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                />

                {geoPoints.map((point, idx) => (
                    <Marker key={idx} position={point.position} icon={goldIcon}>
                        <Popup className="custom-popup">
                            <div className="p-2 font-sans bg-black text-white rounded-lg">
                                <h4 className="text-[#d4af37] font-black uppercase text-[10px] tracking-widest mb-1">{point.stage.replace('_', ' ')}</h4>
                                <p className="text-sm font-bold">{point.location}</p>
                                <p className="text-[10px] text-slate-400 mt-1 uppercase font-bold">{point.owner}</p>
                                <p className="text-[10px] text-slate-600 italic">{new Date(point.timestamp).toLocaleDateString()}</p>
                            </div>
                        </Popup>
                    </Marker>
                ))}

                <Polyline
                    positions={polyline}
                    pathOptions={{
                        color: '#d4af37',
                        weight: 4,
                        opacity: 0.6,
                        dashArray: '10, 10',
                        lineCap: 'round'
                    }}
                />
            </MapContainer>

            <div className="absolute top-4 right-4 z-[1000] bg-black/80 backdrop-blur-md px-4 py-2 rounded-full border border-[#d4af37]/20 flex items-center space-x-2">
                <span className="w-2 h-2 bg-[#d4af37] rounded-full animate-pulse"></span>
                <span className="text-[10px] font-black text-white uppercase tracking-widest italic">Live Geolocation Relay</span>
            </div>
        </div>
    );
};

export default TraceMap;
