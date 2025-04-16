// src/App.jsx

import { useState, useEffect, useRef } from "react";
import MapView from "./MapView.jsx";
import InfoPanel from "./InfoPanel.jsx";
import FleetTable from "./FleetTable.jsx";
import AltitudeGraph from "./charts/AltitudeGraph.jsx";
import SatsGraph from "./charts/SatsGraph.jsx";
import HDOPGraph from "./charts/HDOPGraph.jsx";
import Mermaid from "react-mermaid2"; // for rendering Mermaid diagrams

import "leaflet/dist/leaflet.css";
import "./styles.css";               // main styling
import { generateNMEA } from "./nmeaUtils.js";

function App() {
  const [vehicles, setVehicles] = useState([]);

  // Toggles for table & graphs
  const [showTable, setShowTable] = useState(false);
  const [showGraphs, setShowGraphs] = useState(false);

  // Docs overlay + optional full-screen reading
  const [showDocs, setShowDocs] = useState(false);
  const [docsFullscreen, setDocsFullscreen] = useState(false);

  // For adding new vehicles
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
      altitude: 0,
      sats: 0,
      hdop: 0,
      history: [],
    };
    setVehicles((prev) => [...prev, newVehicle]);
  };

  // Simulate random movement & data every 0.8 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setVehicles((prevVehicles) =>
        prevVehicles.map((v) => {
          // random lat/lng offsets
          const latOffset = (Math.random() - 0.5) / 200;
          const lngOffset = (Math.random() - 0.5) / 200;
          const newLat = v.coords[0] + latOffset;
          const newLng = v.coords[1] + lngOffset;

          // random altitude, satCount, hdop
          const altitude = 500 + Math.random() * 100; 
          const satCount = Math.floor(Math.random() * 5) + 7;
          const hdopVal = (Math.random() * 2).toFixed(1);

          // Build GGA
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

      {/* Bottom-right buttons in a flex container */}
      <div className="toggle-btn-container">
        <button className="toggle-nmea-btn" onClick={() => setShowTable((prev) => !prev)}>
          {showTable ? "Hide NMEA" : "Read NMEA"}
        </button>
        <button className="toggle-nmea-btn" onClick={() => setShowGraphs((prev) => !prev)}>
          {showGraphs ? "Hide Graphs" : "Visualize NMEA"}
        </button>
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

      {/* Docs Overlay (semi-transparent white) */}
      {showDocs && (
        <div className={`footer-docs ${docsFullscreen ? "fullscreen-docs" : ""}`}>
          <h3>How It Works (Technical Overview)</h3>
          <p>
            This demo is built with <strong>React + Vite</strong> and uses{" "}
            <strong>Leaflet</strong> for map rendering. Every <em>0.8 seconds</em>, 
            each vehicle’s position is updated with a small random offset.
          </p>
          <ol>
            <li>
              <strong>Random Movement:</strong> 
              <code>App.jsx</code> uses <code>setInterval</code> to shift lat/long, simulating motion.
            </li>
            <li>
              <strong>NMEA Generation:</strong>  
              We build three primary sentences:
              <ul style={{ marginLeft: "1.5rem" }}>
                <li><code>GGA</code> – Fix data (lat, lng, altitude, fix quality, etc.)</li>
                <li><code>ZDA</code> – Date/time stamps (UTC-based)</li>
                <li><code>GSV</code> – Satellites in view (simulated signals)</li>
              </ul>
              Random <em>altitude</em>, <em>sats</em> (sat count), and <em>HDOP</em> 
              (horizontal dilution) are injected to vary the data.
            </li>
            <li>
              <strong>Leaflet Map &amp; Markers:</strong> 
              <code>MapView.jsx</code> updates each vehicle’s marker. Click the map to add vehicles.
            </li>
            <li>
              <strong>Fleet Table &amp; Charts:</strong> 
              “Read NMEA” toggles a table (with alt, sats, HDOP), 
              “Visualize NMEA” toggles Recharts-based graphs.
            </li>
          </ol>
          <p>
            For more details, see{" "}
            <a
              href="https://github.com/YourUser/YourRepo"
              target="_blank"
              rel="noopener noreferrer"
            >
              this GitHub repo
            </a>.
          </p>

          <h4>System Flow Diagram</h4>
          <Mermaid
            chart={`
              flowchart LR
                A[Random Movement in App.jsx] --> B(NMEA Generation: GGA, ZDA, GSV)
                B --> C[Vehicles State]
                C --> D[MapView: Leaflet Markers]
                D --> E[Table & Chart Overlays]
            `}
            className="my-mermaid"
          />

          <button className="fullscreen-toggle" onClick={() => setDocsFullscreen((prev) => !prev)}>
            {docsFullscreen ? "Exit Full Screen" : "Full Screen Reading"}
          </button>
        </div>
      )}
    </>
  );
}

export default App;
