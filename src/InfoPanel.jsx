// src/InfoPanel.jsx
import React from "react";

const InfoPanel = ({ vehicles }) => {
  return (
    <div className="fleet-panel">
      <h2>Fleet Status</h2>
      {vehicles.length === 0 ? (
        <p>No vehicles yet. Click on the map to add one.</p>
      ) : (
        vehicles.map((vehicle) => (
          <div className="vehicle" key={vehicle.id}>
            <div className="vehicle-title">{vehicle.name}</div>
            <div className="vehicle-info">
              <strong>Lat:</strong> {vehicle.coords[0].toFixed(5)}
            </div>
            <div className="vehicle-info">
              <strong>Lng:</strong> {vehicle.coords[1].toFixed(5)}
            </div>
            <div className="vehicle-info">
              <strong>NMEA:</strong> {vehicle.nmea || "—"}
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default InfoPanel;
