import React from 'react';
import { Radar, RadarChart as RechartsRadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Legend } from 'recharts';

interface RadarChartProps {
  data: any[];
  userKey: string;
  industryKey?: string;
  className?: string;
}

export function RadarChart({ data, userKey, industryKey, className }: RadarChartProps) {
  return (
    <div className={className} style={{ width: '100%', height: '100%', minHeight: 300 }}>
      <ResponsiveContainer width="100%" height="100%">
        <RechartsRadarChart cx="50%" cy="50%" outerRadius="70%" data={data}>
          <PolarGrid key="grid" stroke="rgba(0,0,0,0.08)" />
          <PolarAngleAxis key="angle" dataKey="subject" tick={{ fill: 'var(--color-text-secondary)', fontSize: 12, fontFamily: 'var(--font-mono)' }} />
          <PolarRadiusAxis key="radius" angle={30} domain={[0, 100]} tick={false} axisLine={false} />
          <Radar
            key="user"
            name="Your Skills"
            dataKey={userKey}
            stroke="var(--color-secondary)"
            strokeWidth={2}
            fill="var(--color-secondary)"
            fillOpacity={0.15}
          />
          {industryKey && (
            <Radar
              key="industry"
              name="Industry Demand"
              dataKey={industryKey}
              stroke="var(--color-primary)"
              strokeWidth={2}
              strokeDasharray="4 4"
              fill="transparent"
            />
          )}
          <Legend key="legend" wrapperStyle={{ fontSize: 12, paddingTop: 20 }} />
        </RechartsRadarChart>
      </ResponsiveContainer>
    </div>
  );
}
