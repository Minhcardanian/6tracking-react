// src/FleetTable.jsx

import { parseGGA, parseZDA } from "./nmeaParser";

export default function FleetTable({ vehicles }) {
  return (
    <div className="fleet-table">
      <h2>Position and Time Details</h2>
      <table>
        <thead>
          <tr>
            <th>Vehicle</th>
            <th>Date</th>
            <th>Time (UTC)</th>
            <th>Latitude</th>
            <th>Longitude</th>
            <th>Altitude</th>
            <th>Fix</th>
            <th>Fix Quality</th>
            <th>Sats</th>
            <th>HDOP</th>
          </tr>
        </thead>
        <tbody>
          {vehicles.map((v) => {
            // parse GGA/ZDA for date/time/lat/lng if needed
            const gga = parseGGA(v.nmea.gga);
            const zda = parseZDA(v.nmea.zda);

            // random altitude/sats/hdop from v
            const alt = v.altitude?.toFixed(1) ?? "N/A";
            const sats = v.sats ?? "N/A";
            const hdop = v.hdop?.toFixed(1) ?? "N/A";

            return (
              <tr key={v.id}>
                <td>{v.name}</td>
                <td>{zda?.date || "N/A"}</td>
                <td>{zda?.time || "N/A"}</td>
                <td>{gga?.lat || "N/A"}</td>
                <td>{gga?.lng || "N/A"}</td>
                <td>{alt}</td>
                <td>{gga?.fix || "N/A"}</td>
                <td>{gga?.quality || "N/A"}</td>
                <td>{sats}</td>
                <td>{hdop}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
