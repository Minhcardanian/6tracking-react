// src/charts/HDOPGraph.jsx

import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function HDOPGraph({ vehicles }) {
  // Now read hdop from the vehicle object
  const data = vehicles.map(v => ({
    name: v.name,
    hdop: v.hdop || 0, // fallback to 0 if undefined
  }));

  return (
    <div className="chart-container">
      <h3>HDOP (Horizontal Dilution of Precision)</h3>
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={data}>
          <defs>
            <linearGradient id="colorHdop" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis dataKey="name" />
          <YAxis />
          <CartesianGrid strokeDasharray="3 3" />
          <Tooltip />
          <Area
            type="monotone"
            dataKey="hdop"
            stroke="#8884d8"
            fillOpacity={1}
            fill="url(#colorHdop)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
