import React from "react";
import { AreaChart, Area, XAxis, Tooltip, ResponsiveContainer } from "recharts";

export default function ElectricityTrend(ElectricityData) {
  // Generate hourly data for solar forecast (12:00 AM to 11:00 PM)
  const data = [];
  for (let i = 0; i < 24; i++) {
    const hour =
      i === 0 ? "12am" : i === 12 ? "12pm" : i > 12 ? `${i - 12}pm` : `${i}am`;

    let watts = ElectricityData.ElectricityData[i];
    data.push({ time: hour, output: watts });
  }
  
  return (
    <div className="h-full w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{ top: 10, right: 10, left: 10, bottom: 0 }}
        >
          <defs>
            <linearGradient id="solarGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#2480FA" stopOpacity={0.35} />
              <stop offset="95%" stopColor="#2480FA" stopOpacity={0.0} />
            </linearGradient>
          </defs>

          {/* X Axis configuration */}
          <XAxis
            dataKey="time"
            axisLine={false}
            tickLine={false}
            tick={{ fill: "#94a3b8", fontSize: 12 }}
            // Only show select hours to keep the UI clean
            interval={3}
          />

          {/* Custom Tooltip */}
          <Tooltip
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                return (
                  <div className="bg-overlay border border-border p-3 rounded-lg shadow-md">
                    <p className="text-xs font-medium">
                      {payload[0].payload.time}
                    </p>
                    <p className="text-sm text-blue-600 font-bold">
                      {payload[0].value}
                      <span className="text-xs font-normal">kWh</span>
                    </p>
                  </div>
                );
              }
              return null;
            }}
          />

          {/* Area Line and Fill */}
          <Area
            type="monotone"
            dataKey="output"
            stroke="#2480FA"
            strokeWidth={2}
            fillOpacity={1}
            fill="url(#solarGradient)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
