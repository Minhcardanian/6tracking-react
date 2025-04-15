import { useState, useEffect } from "react";
import MapView from "./MapView.jsx";
import InfoPanel from "./InfoPanel.jsx";
import "leaflet/dist/leaflet.css"; 
import "./styles.css";

function App() {
  const [coords, setCoords] = useState([10.762622, 106.660172]);
  const [nmea, setNmea] = useState("");

  useEffect(() => {
    const interval = setInterval(() => {
      const lat = 10.762622 + (Math.random() - 0.5) / 1000;
      const lng = 106.660172 + (Math.random() - 0.5) / 1000;
      const nmeaStr = `$GPGGA,123519,${lat.toFixed(5)},N,${lng.toFixed(5)},E,1,08,0.9,545.4,M,46.9,M,,*47`;

      setCoords([lat, lng]);
      setNmea(nmeaStr);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="container">
      <h1 className="header">🚚 Transport Location Tracker</h1>
      <MapView coords={coords} />
      <InfoPanel lat={coords[0]} lng={coords[1]} nmea={nmea} />
    </div>
  );
}

export default App;
