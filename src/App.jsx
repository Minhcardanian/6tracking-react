// src/App.jsx

import { useState, useEffect, useRef } from "react";
import MapView from "./MapView.jsx";
import InfoPanel from "./InfoPanel.jsx";
import "leaflet/dist/leaflet.css";
import "./styles.css";

function App() {
  const [vehicles, setVehicles] = useState([]);
  const nextVehicleId = useRef(1);

  // Add a new vehicle on map click, with an empty history.
  const addVehicle = (lat, lng) => {
    const vehicleNumber = nextVehicleId.current;
    nextVehicleId.current += 1;
    const newVehicle = {
      id: vehicleNumber,
      name: `Vehicle ${vehicleNumber}`,
      coords: [lat, lng],
      nmea: "",
      history: []  // Store a trail of previous coordinates (optional)
    };
    setVehicles((prev) => [...prev, newVehicle]);
  };

  // Update vehicles every 0.8s with faster movement and update their trail.
  useEffect(() => {
    const interval = setInterval(() => {
      setVehicles((prevVehicles) =>
        prevVehicles.map((v) => {
          // Increase movement speed by generating larger offsets
          const latOffset = (Math.random() - 0.5) / 200;
          const lngOffset = (Math.random() - 0.5) / 200;
          const newLat = v.coords[0] + latOffset;
          const newLng = v.coords[1] + lngOffset;
          const newNmea = `$GPGGA,123519,${newLat.toFixed(5)},N,${newLng.toFixed(5)},E,1,08,0.9,545.4,M,46.9,M,,*47`;
          
          // Update the vehicle's history by appending the previous coordinate.
          const newHistory = [...v.history, v.coords];
          if (newHistory.length > 10) newHistory.shift();

          return {
            ...v,
            coords: [newLat, newLng],
            nmea: newNmea,
            history: newHistory
          };
        })
      );
    }, 800);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="content">
      <div className="map-container">
        <MapView vehicles={vehicles} onMapClick={addVehicle} />
      </div>
      <div className="info-container">
        <InfoPanel vehicles={vehicles} />
      </div>
    </div>
  );
}

export default App;
