// src/charts/SatsGraph.jsx
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

export default function SatsGraph({ vehicles }) {
  const data = vehicles.map(v => ({
    name: v.name,
    // If your App.jsx sets v.sats, read it here
    sats: v.sats || 0 // fallback to 0 if undefined
  }));

  return (
    <div className="chart-container">
      <h3>Satellites in View</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="sats" fill="#82ca9d" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
