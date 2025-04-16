// src/App.jsx

import { useState, useEffect, useRef } from "react";
import MapView from "./MapView.jsx";
import InfoPanel from "./InfoPanel.jsx";
import FleetTable from "./FleetTable.jsx";
import AltitudeGraph from "./charts/AltitudeGraph.jsx";
import SatsGraph from "./charts/SatsGraph.jsx";
import HDOPGraph from "./charts/HDOPGraph.jsx";
import "leaflet/dist/leaflet.css";
import "./styles.css";
import { generateNMEA } from "./nmeaUtils.js";

function App() {
  // State for vehicles
  const [vehicles, setVehicles] = useState([]);

  // Toggles for table & graphs
  const [showTable, setShowTable] = useState(false);
  const [showGraphs, setShowGraphs] = useState(false);

  const nextVehicleId = useRef(1);

  // Add a new vehicle when map is clicked
  const addVehicle = (lat, lng) => {
    const vehicleNumber = nextVehicleId.current;
    nextVehicleId.current += 1;
    const newVehicle = {
      id: vehicleNumber,
      name: `Vehicle ${vehicleNumber}`,
      coords: [lat, lng],
      nmea: { gga: "", zda: "", gsv: "" },
      history: [],
      altitude: 0,
      sats: 0,
      hdop: 0,
    };
    setVehicles((prev) => [...prev, newVehicle]);
  };

  // Simulated GPS updates
  useEffect(() => {
    const interval = setInterval(() => {
      setVehicles((prevVehicles) =>
        prevVehicles.map((v) => {
          // Random offsets for lat/lng
          const latOffset = (Math.random() - 0.5) / 200;
          const lngOffset = (Math.random() - 0.5) / 200;
          const newLat = v.coords[0] + latOffset;
          const newLng = v.coords[1] + lngOffset;

          // Generate random altitude, sats, hdop
          const altitude = 500 + Math.random() * 100;          // 500–600
          const satCount = Math.floor(Math.random() * 5) + 7;  // 7–11
          const hdopVal = (Math.random() * 2).toFixed(1);      // 0.0–2.0

          // Build GGA with those fields
          const rawGGA = `$GPGGA,123519,${newLat.toFixed(5)},N,${newLng.toFixed(5)},E,1,${satCount},${hdopVal},${altitude.toFixed(1)},M,46.9,M,,`;
          const fullGGA = generateNMEA(rawGGA);

          // Build ZDA (time/date)
          const now = new Date();
          const pad = (num) => num.toString().padStart(2, "0");
          const timeStr = `${pad(now.getUTCHours())}${pad(now.getUTCMinutes())}${pad(now.getUTCSeconds())}`;
          const dateStr = `${pad(now.getUTCDate())},${pad(now.getUTCMonth() + 1)},${now.getUTCFullYear()}`;
          const rawZDA = `$GPZDA,${timeStr},${dateStr},00,00`;
          const fullZDA = generateNMEA(rawZDA);

          // Build GSV
          const rawGSV = `$GPGSV,2,1,08,01,40,083,41,02,17,308,43,03,33,055,42,04,22,123,40`;
          const fullGSV = generateNMEA(rawGSV);

          return {
            ...v,
            coords: [newLat, newLng],
            nmea: { gga: fullGGA, zda: fullZDA, gsv: fullGSV },
            altitude,        // Store random altitude
            sats: satCount,  // Store random sat count
            hdop: parseFloat(hdopVal), // Store random HDOP as number
          };
        })
      );
    }, 800);

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      {/* Main Layout */}
      <div className="content">
        <div className="map-container">
          <MapView vehicles={vehicles} onMapClick={addVehicle} />
        </div>
        <div className="info-container">
          <InfoPanel vehicles={vehicles} />
        </div>
      </div>

      {/* Button to toggle NMEA Table */}
      <button
        className="toggle-nmea-btn"
        onClick={() => setShowTable((prev) => !prev)}
      >
        {showTable ? "Hide NMEA" : "Read NMEA"}
      </button>

      {/* Button to toggle Graphs */}
      <button
        className="toggle-nmea-btn graph-btn"
        onClick={() => setShowGraphs((prev) => !prev)}
      >
        {showGraphs ? "Hide Graphs" : "Visualize NMEA"}
      </button>

      {/* If showTable => Show FleetTable */}
      {showTable && (
        <div className="table-container">
          <FleetTable vehicles={vehicles} />
        </div>
      )}

      {/* If showGraphs => Show the charts */}
      {showGraphs && (
        <div className="graph-container">
          <div className="graph-tabs">
            <h3>Altitude</h3>
            <AltitudeGraph vehicles={vehicles} />
            <h3>Satellites</h3>
            <SatsGraph vehicles={vehicles} />
            <h3>HDOP</h3>
            <HDOPGraph vehicles={vehicles} />
          </div>
        </div>
      )}
    </>
  );
}

export default App;
