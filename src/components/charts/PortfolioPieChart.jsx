/**
 * PortfolioPieChart Component
 * Shows portfolio allocation by asset using Recharts
 */

import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

const COLORS = [
  '#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8',
  '#82CA9D', '#FFC658', '#FF6B9D', '#C9A0DC', '#9ED8DB'
];

const PortfolioPieChart = ({
  data = [],
  height = 300,
  showLegend = true,
  showValue = true
}) => {
  // Format data for pie chart
  const formattedData = data.map(item => ({
    name: item.symbol || item.name,
    value: parseFloat(item.value || item.totalValue || 0),
    percentage: parseFloat(item.percentage || 0)
  }));

  // Custom label to show percentage
  const renderLabel = (entry) => {
    if (!showValue) return '';
    return `${entry.name}: ${entry.percentage?.toFixed(1)}%`;
  };

  // Custom tooltip
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      return (
        <div className="custom-tooltip" style={{
          backgroundColor: 'white',
          padding: '10px',
          border: '1px solid #ccc',
          borderRadius: '4px'
        }}>
          <p className="label" style={{ margin: 0, fontWeight: 'bold' }}>
            {data.name}
          </p>
          <p style={{ margin: '5px 0 0 0', color: '#666' }}>
            Value: ${data.value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
          <p style={{ margin: '5px 0 0 0', color: '#666' }}>
            Allocation: {data.payload.percentage?.toFixed(2)}%
          </p>
        </div>
      );
    }
    return null;
  };

  if (!formattedData || formattedData.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '50px', color: '#999' }}>
        <p>No portfolio data available</p>
      </div>
    );
  }

  return (
    <div className="portfolio-pie-chart">
      <ResponsiveContainer width="100%" height={height}>
        <PieChart>
          <Pie
            data={formattedData}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={renderLabel}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
          >
            {formattedData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          {showLegend && <Legend />}
          <Tooltip content={<CustomTooltip />} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PortfolioPieChart;
