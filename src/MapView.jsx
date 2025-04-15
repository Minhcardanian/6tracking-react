import { useEffect, useRef } from "react";
import L from "leaflet";

const MapView = ({ coords }) => {
  const mapRef = useRef(null);
  const markerRef = useRef(null);

  useEffect(() => {
    // Only create the map once
    if (!mapRef.current) {
      mapRef.current = L.map("map").setView(coords, 15);

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "© OpenStreetMap contributors",
      }).addTo(mapRef.current);

      markerRef.current = L.marker(coords).addTo(mapRef.current);
    }
  }, []);

  useEffect(() => {
    // Only update marker if it exists
    if (markerRef.current) {
      markerRef.current.setLatLng(coords);
    }
  }, [coords]);

  return <div id="map" style={{ height: "400px", width: "100%" }} />;
};

export default MapView;
