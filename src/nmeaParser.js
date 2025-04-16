// src/nmeaParser.js
export function parseGGA(sentence) {
    const parts = sentence.split(",");
    if (parts[0] !== "$GPGGA") return null;
  
    const lat = parseFloat(parts[2]);
    const lng = parseFloat(parts[4]);
    const fixQuality = parts[6];
    const numSatellites = parts[7];
    const hdop = parts[8];
    const altitude = parts[9];
    const time = parts[1]; // HHMMSS
  
    return {
      time,
      lat,
      lng,
      fix: fixQuality === "1" ? "GPS" : "N/A",
      quality: fixQuality,
      sats: numSatellites,
      hdop,
      alt: altitude,
    };
  }
  
  export function parseZDA(sentence) {
    const parts = sentence.split(",");
    if (parts[0] !== "$GPZDA") return null;
  
    const time = parts[1]; // HHMMSS
    const day = parts[2];
    const month = parts[3];
    const year = parts[4];
  
    return {
      date: `${day}/${month}/${year}`,
      time,
    };
  }
  