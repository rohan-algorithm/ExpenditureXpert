import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { LineChart } from '@mui/x-charts/LineChart';
import Header from '../../component/Header'; // Adjust the import path as needed

const LineChartComparison = () => {
  const [xAxisData, setXAxisData] = useState([]);
  const [seriesData, setSeriesData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userId = sessionStorage.getItem('id');
        const response = await axios.get(`http://localhost:5001/api/v5/monthly/${userId}`);
        const data = response.data;

        // Log the raw data from the backend
        console.log('Raw Data:', data);

        // Transform the data
        const transformedData = Object.keys(data).map(month => {
          return { name: month, ...data[month] };
        });

        // Log the transformed data
        console.log('Transformed Data:', transformedData);

        // Extract x-axis data (months)
        const xAxis = transformedData.map(item => item.name);

        // Extract series data for each category
        const allCategories = new Set();
        transformedData.forEach(item => {
          Object.keys(item).forEach(key => {
            if (key !== 'name') {
              allCategories.add(key);
            }
          });
        });

        const series = [...allCategories].map(category => {
          return {
            label: category,
            data: transformedData.map(item => {
              const value = item[category];
              return typeof value === 'number' ? value : 0;
            }),
            area: true,
          };
        });

        setXAxisData(xAxis);
        setSeriesData(series);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  // Log the final data to be passed to the LineChart
  console.log('Final xAxisData:', xAxisData);
  console.log('Final seriesData:', seriesData);

  return (
    <div style={{ width: '100%', height: '500px' }}>
      <Header
        title="MONTHLY EXPENSES COMPARISON"
        subtitle="Comparison between Previous Month and Current Month"
      />
      <LineChart
        width={1000}
        height={500}
        series={seriesData}
        xAxis={[{ scaleType: 'point', data: xAxisData }]}
      />
    </div>
  );
};

export default LineChartComparison;