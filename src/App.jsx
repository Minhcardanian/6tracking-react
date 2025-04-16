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
  const [vehicles, setVehicles] = useState([]);

  // Toggles for table & graphs
  const [showTable, setShowTable] = useState(false);
  const [showGraphs, setShowGraphs] = useState(false);

  // Toggle for docs overlay + optional fullscreen
  const [showDocs, setShowDocs] = useState(false);
  const [docsFullscreen, setDocsFullscreen] = useState(false);

  const nextVehicleId = useRef(1);

  // Add vehicle upon map click
  const addVehicle = (lat, lng) => {
    const vehicleNumber = nextVehicleId.current;
    nextVehicleId.current += 1;
    const newVehicle = {
      id: vehicleNumber,
      name: `Vehicle ${vehicleNumber}`,
      coords: [lat, lng],
      nmea: { gga: "", zda: "", gsv: "" },
      altitude: 0,
      sats: 0,
      hdop: 0,
      history: [],
    };
    setVehicles((prev) => [...prev, newVehicle]);
  };

  // Simulate random movement & data every 0.8s
  useEffect(() => {
    const interval = setInterval(() => {
      setVehicles((prevVehicles) =>
        prevVehicles.map((v) => {
          // random lat/lng offset
          const latOffset = (Math.random() - 0.5) / 200;
          const lngOffset = (Math.random() - 0.5) / 200;
          const newLat = v.coords[0] + latOffset;
          const newLng = v.coords[1] + lngOffset;

          // random altitude, satCount, hdop
          const altitude = 500 + Math.random() * 100;
          const satCount = Math.floor(Math.random() * 5) + 7;
          const hdopVal = (Math.random() * 2).toFixed(1);

          // Build GGA sentence
          const rawGGA = `$GPGGA,123519,${newLat.toFixed(
            5
          )},N,${newLng.toFixed(
            5
          )},E,1,${satCount},${hdopVal},${altitude.toFixed(
            1
          )},M,46.9,M,,`;
          const fullGGA = generateNMEA(rawGGA);

          // Build ZDA
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
            altitude,
            sats: satCount,
            hdop: parseFloat(hdopVal),
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

      {/* FLOATING BUTTONS IN A CONTAINER */}
      <div className="toggle-btn-container">
        {/* 1) Table Toggle */}
        <button className="toggle-nmea-btn" onClick={() => setShowTable((prev) => !prev)}>
          {showTable ? "Hide NMEA" : "Read NMEA"}
        </button>

        {/* 2) Graphs Toggle */}
        <button className="toggle-nmea-btn" onClick={() => setShowGraphs((prev) => !prev)}>
          {showGraphs ? "Hide Graphs" : "Visualize NMEA"}
        </button>

        {/* 3) Docs Toggle */}
        <button className="toggle-nmea-btn" onClick={() => setShowDocs((prev) => !prev)}>
          {showDocs ? "Hide Info" : "How It Works"}
        </button>
      </div>

      {/* Table Overlay */}
      {showTable && (
        <div className="table-container">
          <FleetTable vehicles={vehicles} />
        </div>
      )}

      {/* Graph Overlay */}
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

      {/* Semi-Transparent White Docs Overlay */}
      {showDocs && (
        <div className={`footer-docs ${docsFullscreen ? "fullscreen-docs" : ""}`}>
          <h3>How It Works (Technical Overview)</h3>
          <p>
            This demo is built with <strong>React + Vite</strong> and uses <strong>Leaflet</strong> 
            for map rendering. Every <em>0.8 seconds</em>, each vehicle’s position is updated with 
            a small random offset to simulate movement.
          </p>
          <ol>
            <li>
              <strong>Random Movement:</strong>  
              <code>App.jsx</code> uses a <code>setInterval</code> to shift lat/long for each vehicle.
            </li>
            <li>
              <strong>NMEA Generation:</strong>  
              We build <code>GGA</code> (fix data), <code>ZDA</code> (date/time), 
              and <code>GSV</code> (satellite info) with random altitude, satellites, 
              and HDOP. Stored in the <code>vehicles</code> state.
            </li>
            <li>
              <strong>Leaflet Map &amp; Markers:</strong>  
              <code>MapView.jsx</code> initializes a Leaflet map, updating each vehicle’s marker 
              position. Click the map to add new vehicles.
            </li>
            <li>
              <strong>Fleet Table &amp; Charts:</strong>  
              The “Read NMEA” button toggles the table (alt, sats, HDOP). “Visualize NMEA” shows 
              Recharts-based graphs for altitude, satellites, and HDOP.
            </li>
          </ol>
          <p>
            For more details or to view the source code, check out{" "}
            <a
              href="https://github.com/YourUser/YourRepo"
              target="_blank"
              rel="noopener noreferrer"
            >
              this GitHub repo
            </a>.
          </p>

          {/* Full-screen toggle */}
          <button className="fullscreen-toggle" onClick={() => setDocsFullscreen((prev) => !prev)}>
            {docsFullscreen ? "Exit Full Screen" : "Full Screen Reading"}
          </button>
        </div>
      )}
    </>
  );
}

export default App;
