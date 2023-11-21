import React, { useState, useEffect } from 'react';
import { PieChart } from '@mui/x-charts/PieChart';
import axios from 'axios';
import { useTheme } from '@mui/material/styles';
import Header from 'component/Header';

const PieActiveArc = () => {
  const theme = useTheme();
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userId = sessionStorage.getItem('id');
        const response = await axios.get(`http://localhost:5001/api/v5/pie/${userId}`);
        const { expensesByCategory } = response.data;

        const newData = Object.entries(expensesByCategory).map(([label, value], index) => ({
          id: index,
          value,
          label,
        }));

        setData(newData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const customColors = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300']; // Define your custom colors here

  return (
    <>
      <Header
        title="OVERVIEW"
        subtitle="Overview of general Expenses Category Wise"
      
      />
      <PieChart
        sx={{ marginTop: '4rem' }} 
        series={[
          {
            data,
            highlightScope: { faded: 'global', highlighted: 'item' },
            faded: {
              innerRadius: 30,
              additionalRadius: -30,
              color: theme.palette.grey[500], // Example using grey from theme
            },
          },
        ]}
        height={310}
        colors={customColors}
      />
    </>
  );
};

export default PieActiveArc;
