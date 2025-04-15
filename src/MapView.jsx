// src/MapView.jsx

import { useEffect, useRef } from "react";
import L from "leaflet";

const MapView = ({ vehicles, onMapClick }) => {
  const mapRef = useRef(null);
  const markersRef = useRef({});

  useEffect(() => {
    if (!mapRef.current) {
      mapRef.current = L.map("map").setView([10.762622, 106.660172], 13);

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "© OpenStreetMap contributors",
      }).addTo(mapRef.current);

      mapRef.current.whenReady(() => {
        document.getElementById("map")?.classList.add("loaded");
      });

      mapRef.current.on("click", (e) => {
        const { lat, lng } = e.latlng;
        onMapClick(lat, lng);
      });
    }
  }, [onMapClick]);

  useEffect(() => {
    if (!mapRef.current) return;
    vehicles.forEach((vehicle) => {
      if (!markersRef.current[vehicle.id]) {
        markersRef.current[vehicle.id] = L.marker(vehicle.coords).addTo(mapRef.current);
      } else {
        markersRef.current[vehicle.id].setLatLng(vehicle.coords);
      }
    });
  }, [vehicles]);

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
