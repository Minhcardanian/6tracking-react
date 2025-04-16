// src/charts/SatsGraph.jsx
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

export default function SatsGraph({ vehicles }) {
  // Now read `sats` directly from the vehicle object.
  // This assumes you've added a `sats` field in App.jsx updates.
  const data = vehicles.map(v => ({
    name: v.name,
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
