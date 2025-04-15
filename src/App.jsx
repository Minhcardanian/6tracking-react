// src/App.jsx

import { useState, useEffect, useRef } from "react";
import MapView from "./MapView.jsx";
import InfoPanel from "./InfoPanel.jsx";
import "leaflet/dist/leaflet.css";
import "./styles.css";
// Import the NMEA utility functions
import { generateNMEA } from "./nmeaUtils.js";

function App() {
  const [vehicles, setVehicles] = useState([]);
  const nextVehicleId = useRef(1);

  const addVehicle = (lat, lng) => {
    const vehicleNumber = nextVehicleId.current;
    nextVehicleId.current += 1;
    const newVehicle = {
      id: vehicleNumber,
      name: `Vehicle ${vehicleNumber}`,
      coords: [lat, lng],
      nmea: { gga: "", zda: "", gsv: "" },
      history: [],
    };
    setVehicles((prev) => [...prev, newVehicle]);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setVehicles((prevVehicles) =>
        prevVehicles.map((v) => {
          const latOffset = (Math.random() - 0.5) / 200;
          const lngOffset = (Math.random() - 0.5) / 200;
          const newLat = v.coords[0] + latOffset;
          const newLng = v.coords[1] + lngOffset;

          // Build raw GGA sentence without checksum.
          const rawGGA = `$GPGGA,123519,${newLat.toFixed(5)},N,${newLng.toFixed(5)},E,1,08,0.9,545.4,M,46.9,M,,`;
          const fullGGA = generateNMEA(rawGGA);

          // Create raw ZDA sentence.
          const now = new Date();
          const pad = num => num.toString().padStart(2, "0");
          const timeStr = `${pad(now.getUTCHours())}${pad(now.getUTCMinutes())}${pad(now.getUTCSeconds())}`;
          const dateStr = `${pad(now.getUTCDate())},${pad(now.getUTCMonth() + 1)},${now.getUTCFullYear()}`;
          const rawZDA = `$GPZDA,${timeStr},${dateStr},00,00`;
          const fullZDA = generateNMEA(rawZDA);

          // Create a raw GSV sentence (sample data).
          const rawGSV = `$GPGSV,2,1,08,01,40,083,41,02,17,308,43,03,33,055,42,04,22,123,40`;
          const fullGSV = generateNMEA(rawGSV);

          return {
            ...v,
            coords: [newLat, newLng],
            nmea: { gga: fullGGA, zda: fullZDA, gsv: fullGSV },
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
