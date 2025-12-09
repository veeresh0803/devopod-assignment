import React from 'react';
import { PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer } from 'recharts';
import './RiskChart.css';

const RiskChart = ({ data }) => {
  const riskCounts = {
    Critical: data.filter((r) => r.riskLevel === 'Critical').length,
    High: data.filter((r) => r.riskLevel === 'High').length,
    Medium: data.filter((r) => r.riskLevel === 'Medium').length,
    Low: data.filter((r) => r.riskLevel === 'Low').length,
  };

  const chartData = [
    { name: 'Critical', value: riskCounts.Critical, fill: '#dc3545' },
    { name: 'High', value: riskCounts.High, fill: '#fd7e14' },
    { name: 'Medium', value: riskCounts.Medium, fill: '#ffc107' },
    { name: 'Low', value: riskCounts.Low, fill: '#28a745' },
  ].filter((item) => item.value > 0);

  if (chartData.length === 0) {
    return <p className="no-data">No projects to display</p>;
  }

  return (
    <div className="risk-chart-container">
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, value }) => `${name}: ${value}`}
            outerRadius={100}
            fill="#8884d8"
            dataKey="value"
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.fill} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default RiskChart;
