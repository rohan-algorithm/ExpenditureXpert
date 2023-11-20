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
        const response = await axios.get(`http://localhost:5001/api/v5/pie/655661082df3842edf6ec49b`);
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

  return (
    <>
     <Header
        title="OVERVIEW"
        subtitle="Overview of general Expenses Category Wise"
      />
    <PieChart
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
      height={200}
    />
    </>
  );
};

export default PieActiveArc;
