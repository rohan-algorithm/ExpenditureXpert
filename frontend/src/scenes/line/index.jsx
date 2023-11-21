import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import Header from 'component/Header';

const LineChartComparison = () => {
  const [monthlyData, setMonthlyData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userId = sessionStorage.getItem('id');
        const response = await axios.get(`http://localhost:5001/api/v5/monthlyComparison/${userId}`);
        setMonthlyData(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div style={{ width: '100%', height: '500px' }}>
      <Header
        title="MONTHLY EXPENSES COMPARISON"
        subtitle="Comparison between Previous Month and Current Month"
      />
      <ResponsiveContainer>
        <LineChart data={monthlyData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="currentMonth" stroke="#8884d8" activeDot={{ r: 8 }} />
          <Line type="monotone" dataKey="prevMonth" stroke="#82ca9d" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default LineChartComparison;
