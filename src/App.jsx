// src/App.jsx
import { useState, useEffect, useRef } from "react";
import MapView from "./MapView.jsx";
import InfoPanel from "./InfoPanel.jsx";
import "leaflet/dist/leaflet.css";
import "./styles.css";

function App() {
  const [vehicles, setVehicles] = useState([]);
  const nextVehicleId = useRef(1);

  // Called when user clicks on the map
  const addVehicle = (lat, lng) => {
    const vehicleNumber = nextVehicleId.current;
    nextVehicleId.current += 1;

    const newVehicle = {
      id: vehicleNumber, // numeric ID for sorting or reference
      name: `Vehicle ${vehicleNumber}`,
      coords: [lat, lng],
      nmea: "",
    };
    setVehicles((prev) => [...prev, newVehicle]);
  };

  // Update vehicles every 0.8s with bigger offset => faster movement
  useEffect(() => {
    const interval = setInterval(() => {
      setVehicles((prevVehicles) =>
        prevVehicles.map((v) => {
          // Increase speed by lowering divisor (larger offset)
          const latOffset = (Math.random() - 0.5) / 200;
          const lngOffset = (Math.random() - 0.5) / 200;

          const newLat = v.coords[0] + latOffset;
          const newLng = v.coords[1] + lngOffset;
          const newNmea = `$GPGGA,123519,${newLat.toFixed(5)},N,${newLng.toFixed(5)},E,1,08,0.9,545.4,M,46.9,M,,*47`;

          return { ...v, coords: [newLat, newLng], nmea: newNmea };
        })
      );
    }, 800); // updates every 0.8s

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
