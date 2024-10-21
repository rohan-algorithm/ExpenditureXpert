import React, { useState, useEffect } from 'react';
import { PieChart } from '@mui/x-charts/PieChart';
import axios from 'axios';
import { useTheme } from '@mui/material/styles';
import { Select, MenuItem } from '@mui/material';
import Header from 'component/Header';

const PieActiveArc = () => {
  const theme = useTheme();
  const [data, setData] = useState([]);
  const [viewType, setViewType] = useState('monthly');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userId = sessionStorage.getItem('id');
        const response = await axios.get(`http://localhost:5001/api/v5/pie/${viewType}/${userId}`);
        const { expensesByCategory } = response.data;

        console.log('Fetched data:', expensesByCategory); // Debugging log

        const currentDate = new Date();
        const currentMonth = currentDate.getMonth() + 1; // getMonth() is zero-based
        const currentYear = currentDate.getFullYear();

        const newData = [];
        Object.entries(expensesByCategory).forEach(([label, categories], index) => {
          const [year, month] = label.split('-').map(Number);
          if (
            (viewType === 'monthly' && year === currentYear && month === currentMonth) ||
            (viewType === 'yearly' && year === currentYear)
          ) {
            Object.entries(categories).forEach(([category, value]) => {
              newData.push({
                id: `${index}-${category}`,
                value,
                label: `${label} (${category})`,
              });
            });
          }
        });

        console.log('Formatted data for PieChart:', newData); // Debugging log

        setData(newData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [viewType]);

  const handleViewChange = (event) => {
    setViewType(event.target.value);
  };

  const customColors = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300']; 

  return (
    <>
      <Header
        title="OVERVIEW"
        subtitle="Overview of general Expenses Category Wise"
      />
      <Select
        value={viewType}
        onChange={handleViewChange}
        sx={{ marginBottom: '1rem' }}
      >
        <MenuItem value="monthly">Monthly</MenuItem>
        <MenuItem value="yearly">Yearly</MenuItem>
      </Select>
      {data.length > 0 ? (
        <PieChart
          sx={{ marginTop: '4rem' }} 
          series={[
            {
              data,
              highlightScope: { faded: 'global', highlighted: 'item' },
              faded: {
                innerRadius: 30,
                additionalRadius: -30,
                color: theme.palette.grey[500], 
              },
            },
          ]}
          height={310}
          colors={customColors}
        />
      ) : (
        <p>No data available</p>
      )}
    </>
  );
};

export default PieActiveArc;