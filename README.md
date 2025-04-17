# React Fleet Tracker Demo (React + Vite)

This project is a demo application built with React and Vite that showcases real-time GPS tracking of vehicles (a fleet tracker). It includes client-side simulation of GPS data, interactive mapping, and data visualization, mimicking a simplified server-like GPS telemetry stream.

## System Architecture

```mermaid
flowchart TD
  subgraph Frontend [React + Vite]
    A1[App.jsx]
    A2[MapView.jsx]
    A3[InfoPanel.jsx]
    A4[FleetTable.jsx]
    A5[charts/*]
    A1 --> A2
    A1 --> A3
    A1 --> A4
    A1 --> A5
  end

  subgraph SimulationLoop [Simulation Loop]
    A1 --> B[Random Movement & Data Generation]
    B --> C[NMEA Generator]
    C --> A3
    C --> A4
    C --> A5
  end

  A2 --> D[Leaflet Map & Markers]
  A3 --> E[Fleet Status Panel]
  A4 --> F[NMEA Data Table]
  A5 --> G[Recharts Graphs]
```

- **App.jsx**: Orchestrates state, simulation loop, and overlay toggles.
- **MapView.jsx**: Initializes the Leaflet map, manages a `markersRef` object to store L.marker instances, and on each state update calls `markersRef.current[id].setLatLng(newCoords)` to smoothly move existing markers; also handles adding new vehicles on map clicks.
- **InfoPanel.jsx**: Displays vehicle coordinates and NMEA strings in a styled panel.
- **FleetTable.jsx**: Renders parsed NMEA data (GGA, ZDA, GSV) and random metrics (altitude, sats, HDOP) in a table.
- **charts/**: `AltitudeGraph.jsx`, `SatsGraph.jsx`, `HDOPGraph.jsx` visualize metrics using Recharts.
- **nmeaUtils.js**: Generates NMEA sentences with proper checksums.

## Limitations

- **No Backend Integration**: Simulation and state exist purely on the client; no persistent storage.
- **Simplified Movement**: Vehicles move by random offsets, not along actual roads.
- **Polling vs. Streaming**: Uses `setInterval` instead of real-time protocols like WebSockets or MQTT.
- **No Authentication or Device Registry**: Vehicles are ephemeral and have no security controls.
- **Ideal Signal Conditions**: No handling of GPS noise, loss, or drift beyond a simulated HDOP value.

## Future Improvements

- **Backend Service**: Add a server (Node.js, Firebase) to store and retrieve vehicle telemetry.
- **Live GPS Data**: Use device geolocation (`navigator.geolocation`) or real GPS modules for true location data.
- **Real-Time Streaming**: Replace polling with WebSocket or MQTT streams for low-latency updates.
- **Route Adherence**: Integrate a routing API to constrain movement along actual roads.
- **Device Management**: Implement authentication, device IDs, and role-based access control.
- **Error Handling**: Simulate and recover from GPS signal loss, data gaps, and checksum failures.
- **Historical Playback**: Persist and replay past telemetry for performance analysis.
- **Geo-fencing & Alerts**: Trigger notifications when vehicles enter/exit defined areas.
- **Responsive & Mobile UI**: Optimize the layout for various screen sizes and touch interactions.

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v16+)
- npm or yarn

### Installation

```bash
# Clone the repo
git clone git@github.com:Minhcardanian/6tracking-react.git
cd 6tracking-react

# Install dependencies
npm install
npm install leaflet react-mermaid2

# Run the dev server
npm run dev
```

Open <http://localhost:5173> to view the app. Click on the map to add vehicles and toggle the overlays for tables, graphs, and documentation.

---

For source code and contributions, see the [GitHub repository](https://github.com/YourUser/YourRepo).

