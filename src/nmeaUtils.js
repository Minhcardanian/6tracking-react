// src/nmeaUtils.js

export function calculateNMEAChecksum(sentence) {
    // Remove the starting '$' if present.
    if (sentence.startsWith("$")) {
      sentence = sentence.slice(1);
    }
    // Split at '*' in case there's already a checksum, and take the data part.
    const [data] = sentence.split("*");
    
    let checksum = 0;
    for (let i = 0; i < data.length; i++) {
      checksum ^= data.charCodeAt(i);
    }
    // Convert to a two-digit hexadecimal string
    return checksum.toString(16).toUpperCase().padStart(2, '0');
  }
  
  export function generateNMEA(sentenceWithoutChecksum) {
    const checksum = calculateNMEAChecksum(sentenceWithoutChecksum);
    return `${sentenceWithoutChecksum}*${checksum}`;
  }
  