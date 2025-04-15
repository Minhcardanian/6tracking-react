# React Fleet Tracker Demo (React + Vite)

This project is a demo application built with React and Vite that showcases real-time GPS tracking of vehicles (a fleet tracker). It features:

- A full-screen, two-column layout with a map on the left and a fleet status panel on the right.
- Interactive map functionality using [Leaflet](https://leafletjs.com/):
  - Click on the map to add a new vehicle.
  - Markers update in real time to simulate movement.
  - Each marker displays a simulated NMEA string along with the current latitude and longitude.
- A responsive fleet panel that displays each vehicle’s data in a card-like layout.
- Real-time updates that simulate the movement of vehicles (faster updates and bigger offsets).
- Improved styling to ensure that UI elements (like panel text) are not obscured by scrollbars.

## Project Structure

6tracking/
├── public/
│   └── truck-icon.png          // (static assets, e.g. a custom truck icon, if desired)
├── src/
│   ├── App.jsx                 // Main component managing vehicles and layout
│   ├── InfoPanel.jsx           // Right-side panel displaying fleet data
│   ├── MapView.jsx             // Left-side component handling the Leaflet map and markers
│   ├── main.jsx                // Application entry point
│   └── styles.css              // Global CSS for layout and styling
├── index.html                  // HTML template
├── package.json                // Project configuration and scripts
└── vite.config.js              // Vite configuration file


markdown

## Features

- **Interactive Map:** Click to add vehicles to the map.
- **Real-Time GPS Simulation:** Vehicles update their positions dynamically and generate simulated NMEA data.
- **Draggable and Responsive UI:** The map panel and fleet panel automatically update with current vehicle data.
- **Full-Screen Layout:** A modern, responsive design that adapts to different screen sizes.
- **Polished UI:** Improved styling ensures clear readability and an engaging user experience.

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/en/) (version 16+ recommended)
- npm (or yarn)

### Installation

1. **Clone the repository:**

   ```bash
   git clone git@github.com:Minhcardanian/6tracking-react.git
   cd 6tracking-react
Install dependencies:
npm install
npm install leaflet
Running the Development Server
Start the Vite dev server with:

npm run dev

Open http://localhost:5173 in your browser to view the app.
Click on the map to add vehicles. Watch as each vehicle's data (latitude, longitude, and simulated NMEA string) updates in real time in the fleet panel on the right.