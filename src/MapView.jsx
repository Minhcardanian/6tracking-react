import { useEffect, useRef } from "react";
import L from "leaflet";

const MapView = ({ coords }) => {
  const mapRef = useRef(null);
  const markerRef = useRef(null);

  // Create the map one time on mount
  useEffect(() => {
    if (!mapRef.current) {
      mapRef.current = L.map("map").setView(coords, 15);

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "© OpenStreetMap contributors",
      }).addTo(mapRef.current);

      markerRef.current = L.marker(coords).addTo(mapRef.current);

      // Fade-in effect once the map is ready
      mapRef.current.whenReady(() => {
        const mapElement = document.getElementById("map");
        if (mapElement) {
          mapElement.classList.add("loaded"); 
        }
      });
    }
  }, []);

  // Update marker when coords change
  useEffect(() => {
    if (markerRef.current) {
      markerRef.current.setLatLng(coords);
    }
  }, [coords]);

  // Cleanup if MapView unmounts
  useEffect(() => {
    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  return <div id="map" />;
};

export default MapView;
