import {
  MapContainer,
  TileLayer,
  Marker,
  useMapEvents,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import { useEffect } from "react";
import "leaflet/dist/leaflet.css";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

const RecenterMap = ({ center }) => {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.flyTo(center, 16);
    } else {
      map.flyTo([28.626641, 77.384803], 14);
    }
  }, [center]);
  return null;
};

const LocationMarker = ({ position, onSelect }) => {
  useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng;
      onSelect(lat, lng);
    },
  });

  return position ? <Marker position={position} /> : null;
};

const LocationPicker = ({ onLocationSelect, center }) => {
  return (
    <div className="w-full h-80 rounded-xl overflow-hidden border mb-4">
      <MapContainer
        center={center || [28.626641, 77.384803]}
        zoom={center ? 16 : 5}
        className="h-full w-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <RecenterMap center={center} />

        <LocationMarker position={center} onSelect={onLocationSelect} />
      </MapContainer>
    </div>
  );
};

export default LocationPicker;
