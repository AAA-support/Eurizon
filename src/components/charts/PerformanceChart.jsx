/**
 * PerformanceChart Component
 * Line chart showing portfolio performance over time
 */

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { format } from 'date-fns';

const PerformanceChart = ({
  data = [],
  height = 300,
  showArea = true,
  dataKey = 'value',
  dataKeyLabel = 'Portfolio Value',
  color = '#8884d8'
}) => {
  // Custom tooltip
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const value = payload[0].value;
      const change = payload[0].payload.change || 0;
      const changePercent = payload[0].payload.changePercent || 0;

      return (
        <div className="custom-tooltip" style={{
          backgroundColor: 'white',
          padding: '10px',
          border: '1px solid #ccc',
          borderRadius: '4px'
        }}>
          <p className="label" style={{ margin: 0, fontWeight: 'bold' }}>
            {label}
          </p>
          <p style={{ margin: '5px 0', color: color }}>
            {dataKeyLabel}: ${value?.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
          {change !== undefined && (
            <p style={{
              margin: '5px 0 0 0',
              color: change >= 0 ? '#26a69a' : '#ef5350'
            }}>
              {change >= 0 ? '+' : ''}{change.toFixed(2)} ({changePercent >= 0 ? '+' : ''}{changePercent.toFixed(2)}%)
            </p>
          )}
        </div>
      );
    }
    return null;
  };

  // Format data with proper dates
  const formattedData = data.map(item => ({
    ...item,
    date: item.date || item.time || item.label,
    [dataKey]: parseFloat(item[dataKey] || item.value || 0)
  }));

  if (!formattedData || formattedData.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '50px', color: '#999' }}>
        <p>No performance data available</p>
      </div>
    );
  }

  // Determine if values are positive or negative for coloring
  const hasNegativeValues = formattedData.some(d => d[dataKey] < 0);

  return (
    <div className="performance-chart">
      <ResponsiveContainer width="100%" height={height}>
        {showArea ? (
          <AreaChart data={formattedData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={color} stopOpacity={0.8}/>
                <stop offset="95%" stopColor={color} stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis
              dataKey="date"
              stroke="#999"
              tick={{ fontSize: 12 }}
            />
            <YAxis
              stroke="#999"
              tick={{ fontSize: 12 }}
              tickFormatter={(value) => `$${value.toLocaleString()}`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Area
              type="monotone"
              dataKey={dataKey}
              stroke={color}
              fillOpacity={1}
              fill="url(#colorValue)"
              name={dataKeyLabel}
            />
          </AreaChart>
        ) : (
          <LineChart data={formattedData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis
              dataKey="date"
              stroke="#999"
              tick={{ fontSize: 12 }}
            />
            <YAxis
              stroke="#999"
              tick={{ fontSize: 12 }}
              tickFormatter={(value) => `$${value.toLocaleString()}`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Line
              type="monotone"
              dataKey={dataKey}
              stroke={color}
              strokeWidth={2}
              dot={{ fill: color, r: 4 }}
              activeDot={{ r: 6 }}
              name={dataKeyLabel}
            />
          </LineChart>
        )}
      </ResponsiveContainer>
    </div>
  );
};

export default PerformanceChart;
