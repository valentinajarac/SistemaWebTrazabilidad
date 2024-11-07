import React from 'react';
import {
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface BarChartProps {
  data: any[];
  xAxisKey: string;
  bars: {
    key: string;
    name: string;
    color: string;
  }[];
  height?: number;
}

export function BarChart({ data, xAxisKey, bars, height = 400 }: BarChartProps) {
  return (
    <div style={{ width: '100%', height }}>
      <ResponsiveContainer>
        <RechartsBarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey={xAxisKey}
            tickFormatter={(value) => {
              if (value instanceof Date || !isNaN(Date.parse(value))) {
                return format(new Date(value), 'MMM yyyy', { locale: es });
              }
              return value;
            }}
          />
          <YAxis />
          <Tooltip
            labelFormatter={(value) => {
              if (value instanceof Date || !isNaN(Date.parse(value))) {
                return format(new Date(value), 'MMMM yyyy', { locale: es });
              }
              return value;
            }}
            formatter={(value: number) => [`${value.toFixed(2)} kg`, '']}
          />
          <Legend />
          {bars.map((bar) => (
            <Bar
              key={bar.key}
              dataKey={bar.key}
              name={bar.name}
              fill={bar.color}
            />
          ))}
        </RechartsBarChart>
      </ResponsiveContainer>
    </div>
  );
}