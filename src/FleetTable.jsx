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
            // Parse GGA/ZDA if you want date/time/lat/lng from the NMEA string
            const gga = parseGGA(v.nmea.gga);
            const zda = parseZDA(v.nmea.zda);

            // We also have random alt/sats/hdop in the vehicle object (v.altitude, v.sats, v.hdop)
            // which we want to display in the table
            const alt = v.altitude?.toFixed(1) ?? "N/A";
            const sats = v.sats ?? "N/A";
            const hdop = v.hdop?.toFixed(1) ?? "N/A";

            return (
              <tr key={v.id}>
                <td>{v.name}</td>

                {/* Date/Time from the parsed ZDA (NMEA) */}
                <td>{zda?.date || "N/A"}</td>
                <td>{zda?.time || "N/A"}</td>

                {/* Lat/Lng from parsed GGA (if desired) */}
                <td>{gga?.lat || "N/A"}</td>
                <td>{gga?.lng || "N/A"}</td>

                {/* Altitude, Fix, etc. 
                    We override the altitude, fix, fixQuality, sats, hdop columns
                    with the random fields from the vehicle object. 
                */}
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
