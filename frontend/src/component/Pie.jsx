import React from 'react';
import { PieChart, Pie, Tooltip, Cell } from 'recharts';

const ExpensePieChart = ({ expensesByCategory }) => {
  const data = Object.entries(expensesByCategory).map(([category, amount]) => ({
    category,
    amount,
  }));

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AF19FF']; // Add more colors as needed

  return (
    <PieChart width={400} height={400}>
      <Pie
        data={data}
        dataKey="amount"
        nameKey="category"
        cx="50%"
        cy="50%"
        outerRadius={80}
        fill="#8884d8"
        label
      >
        {data.map((entry, index) => (
          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
        ))}
      </Pie>
      <Tooltip />
    </PieChart>
  );
};

export default ExpensePieChart;
