import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { MenuItem, Select } from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import Header  from 'component/Header';
const MonthlyExpenses = () => {
  const [monthlyData, setMonthlyData] = useState([]);
  const [viewType, setViewType] = useState('monthly');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const userId = sessionStorage.getItem('id');
      const response = await axios.get(`http://localhost:5001/api/v5/${viewType}/${userId}`);
      setMonthlyData(response.data);
    } catch (error) {
      console.error('Error fetching expenses:', error);
    }
  };

  const handleViewChange = async (type) => {
    setViewType(type);
    try {
      const userId = sessionStorage.getItem('id');
      const response = await axios.get(`http://localhost:5001/api/v5/${type}/${userId}`);
      setMonthlyData(response.data);
    } catch (error) {
      console.error('Error fetching expenses:', error);
    }
  };

  const formatDataForChart = () => {
    const chartData = [];
    const sortedMonths = Object.keys(monthlyData).sort();

    sortedMonths.forEach((month) => {
      const categories = monthlyData[month];
      const monthlyTotal = Object.values(categories).reduce((acc, amount) => acc + amount, 0);
      const monthName = new Date(month).toLocaleString('default', { month: 'long' });

      chartData.push({
        month: monthName,
        total: monthlyTotal,
        ...categories,
      });
    });

    return chartData;
  };

  return (
    <div style={{ width: '100%', height: 400 }}>
       <Header title="Expenses" subtitle="Compare Your Expenses Week,Month,Year Wise" />
      <Select
        value={viewType}
        onChange={(e) => handleViewChange(e.target.value)}
      >
        <MenuItem value={'weekly'}>Weekly</MenuItem>
        <MenuItem value={'monthly'}>Monthly</MenuItem>
        <MenuItem value={'yearly'}>Yearly</MenuItem>
      </Select>
      <ResponsiveContainer>
        <BarChart data={formatDataForChart()} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" tick={{ fill: 'white' }} />
          <YAxis tick={{ fill: 'white' }} />
          <Tooltip />
          <Legend />
          <Bar dataKey="Utilities" stackId="a" fill="#8884d8" background={{ fill: 'transparent' }} />
          <Bar dataKey="Food" stackId="a" fill="#82ca9d" background={{ fill: 'transparent' }} />
          <Bar dataKey="Transportation" stackId="a" fill="#ffc658" background={{ fill: 'transparent' }} />
          <Bar dataKey="Others" stackId="a" fill="#ff7300" background={{ fill: 'transparent' }} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default MonthlyExpenses;
