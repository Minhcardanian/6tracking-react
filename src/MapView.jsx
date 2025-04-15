// src/MapView.jsx

import { useEffect, useRef } from "react";
import L from "leaflet";

const MapView = ({ vehicles, onMapClick }) => {
  const mapRef = useRef(null);
  const markersRef = useRef({});   // For markers keyed by vehicle ID
  const polylinesRef = useRef({}); // For polylines keyed by vehicle ID

  // Initialize the map on first render.
  useEffect(() => {
    if (!mapRef.current) {
      mapRef.current = L.map("map").setView([10.762622, 106.660172], 13);

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "© OpenStreetMap contributors",
      }).addTo(mapRef.current);

      // Apply fade-in effect.
      mapRef.current.whenReady(() => {
        const mapElement = document.getElementById("map");
        if (mapElement) {
          mapElement.classList.add("loaded");
        }
      });

      // Listen for clicks on the map to add a new vehicle.
      mapRef.current.on("click", (e) => {
        const { lat, lng } = e.latlng;
        onMapClick(lat, lng);
      });
    }
  }, [onMapClick]);

  // Update markers and draw/update the trail polylines.
  useEffect(() => {
    if (!mapRef.current) return;

    vehicles.forEach((vehicle) => {
      // Update marker for the vehicle.
      if (!markersRef.current[vehicle.id]) {
        markersRef.current[vehicle.id] = L.marker(vehicle.coords).addTo(mapRef.current);
      } else {
        markersRef.current[vehicle.id].setLatLng(vehicle.coords);
      }

      // Draw/update the polyline for the vehicle's history (trail).
      if (vehicle.history && vehicle.history.length > 0) {
        if (!polylinesRef.current[vehicle.id]) {
          polylinesRef.current[vehicle.id] = L.polyline(vehicle.history, {
            color: "orange",
            weight: 3,
            opacity: 0.7,
          }).addTo(mapRef.current);
        } else {
          polylinesRef.current[vehicle.id].setLatLngs(vehicle.history);
        }
      }
    });
  }, [vehicles]);

  // Cleanup the map on component unmount.
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
