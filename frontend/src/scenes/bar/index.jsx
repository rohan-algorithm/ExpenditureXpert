import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { MenuItem, Select } from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import Header from 'component/Header';

const MonthlyExpenses = () => {
  const [data, setData] = useState([]);
  const [viewType, setViewType] = useState('monthly');

  useEffect(() => {
    fetchData();
  }, [viewType]);

  const fetchData = async () => {
    try {
      const userId = sessionStorage.getItem('id');
      const response = await axios.get(`http://localhost:5001/api/v5/${viewType}/${userId}`);
      setData(response.data);
    } catch (error) {
      console.error('Error fetching expenses:', error);
    }
  };

  const handleViewChange = (type) => {
    setViewType(type);
  };

  const formatDataForChart = () => {
    const chartData = [];
  
    if (viewType === 'yearly') {
      const yearlyData = {};
  
      // Aggregate data by year
      Object.keys(data).forEach((key) => {
        const year = new Date(key).getFullYear();
        if (!yearlyData[year]) {
          yearlyData[year] = {};
        }
  
        const categories = data[key];
        Object.keys(categories).forEach((category) => {
          if (!yearlyData[year][category]) {
            yearlyData[year][category] = 0;
          }
          yearlyData[year][category] += categories[category];
        });
      });
  
      // Format the aggregated data for the chart
      Object.keys(yearlyData).forEach((year) => {
        const categories = yearlyData[year];
        const total = Object.values(categories).reduce((acc, amount) => acc + amount, 0);
  
        chartData.push({
          label: year,
          total,
          ...categories,
        });
      });
    } else {
      const sortedKeys = Object.keys(data).sort();
  
      sortedKeys.forEach((key) => {
        const categories = data[key];
        const total = Object.values(categories).reduce((acc, amount) => acc + amount, 0);
        let label;
  
        if (viewType === 'weekly') {
          label = `Week ${key}`;
        } else if (viewType === 'monthly') {
          label = new Date(key).toLocaleString('default', { month: 'long' });
        }
  
        chartData.push({
          label,
          total,
          ...categories,
        });
      });
    }
  
    return chartData;
  };

  return (
    <div style={{ width: '100%', height: 400 }}>
      <Header title="Expenses" subtitle="Compare Your Expenses Week, Month, Year Wise" />
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
          <XAxis dataKey="label" tick={{ fill: 'white' }} />
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