import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import L from 'leaflet';

// Fix Leaflet marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const MapView = ({ shipment }) => {
  const [map, setMap] = useState(null);

  useEffect(() => {
    if (map && shipment) {
      const bounds = L.latLngBounds([
        [shipment.origin.lat, shipment.origin.lng],
        [shipment.destination.lat, shipment.destination.lng]
      ]);
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [map, shipment]);

  if (!shipment) {
    return (
      <div className="w-full h-full glass-panel flex items-center justify-center min-h-[400px]">
        <p className="text-slate-400">Select a shipment to view the map.</p>
      </div>
    );
  }

  const positions = [
    [shipment.origin.lat, shipment.origin.lng],
    [shipment.currentLocation.lat, shipment.currentLocation.lng],
    [shipment.destination.lat, shipment.destination.lng]
  ];

  return (
    <div className="w-full h-full glass-panel overflow-hidden min-h-[400px] relative">
      <MapContainer 
        center={[shipment.currentLocation.lat, shipment.currentLocation.lng]} 
        zoom={6} 
        scrollWheelZoom={false}
        className="w-full h-full absolute inset-0 z-0"
        ref={setMap}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />
        
        <Marker position={[shipment.origin.lat, shipment.origin.lng]}>
          <Popup>Origin: {shipment.origin.name}</Popup>
        </Marker>
        
        <Marker position={[shipment.currentLocation.lat, shipment.currentLocation.lng]}>
          <Popup className="font-bold">Current Location<br/>Status: {shipment.status}</Popup>
        </Marker>

        <Marker position={[shipment.destination.lat, shipment.destination.lng]}>
          <Popup>Destination: {shipment.destination.name}</Popup>
        </Marker>

        {/* Path Traveled (Solid) */}
        <Polyline 
          positions={[positions[0], positions[1]]} 
          pathOptions={{ color: '#10b981', weight: 4 }} 
        />
        
        {/* Path Remaining (Dashed) */}
        <Polyline 
          positions={[positions[1], positions[2]]} 
          pathOptions={{ color: '#f59e0b', weight: 4, dashArray: '10, 10' }} 
        />
      </MapContainer>
    </div>
  );
};

export default MapView;
