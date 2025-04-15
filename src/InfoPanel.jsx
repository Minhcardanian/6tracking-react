const InfoPanel = ({ lat, lng, nmea }) => {
    return (
      <div className="info-panel">
        <h3>📡 GPS Sensor Data</h3>
        <p><strong>Lat:</strong> {lat.toFixed(5)}</p>
        <p><strong>Lng:</strong> {lng.toFixed(5)}</p>
        <p><strong>NMEA:</strong> {nmea}</p>
      </div>
    );
  };
  
  export default InfoPanel;
  