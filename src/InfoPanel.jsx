const InfoPanel = ({ lat, lng, nmea }) => {
    return (
      <div
        style={{
          background: "#f8f9fa",
          padding: "1rem",
          maxWidth: "600px",
          margin: "0 auto",
          borderRadius: "8px",
          boxShadow: "0 0 10px rgba(0,0,0,0.1)",
        }}
      >
        <h3>📡 GPS Sensor Data</h3>
        <p><strong>Lat:</strong> {lat.toFixed(5)}</p>
        <p><strong>Lng:</strong> {lng.toFixed(5)}</p>
        <p><strong>NMEA:</strong> {nmea}</p>
      </div>
    );
  };
  
  export default InfoPanel;
  