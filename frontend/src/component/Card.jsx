import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, CardContent, Typography, useMediaQuery, useTheme } from '@mui/material';

const RowOfAmounts = () => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const [data, setData] = useState({ budget: 0, amountOwed: 0, amountLent: 0 });
  const id  = sessionStorage.getItem('id');
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`http://localhost:5001/api/v4/balance/${id}`);
        setData(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const amounts = [
    { label: 'Balance', value: `$${data.budget}` },
    { label: 'Credit Amount', value: `$${data.amountLent}` },
    { label: 'Debit Amount', value: `$${data.amountOwed}` },
  ];

  return (
    <Card
      sx={{
        display: 'flex',
        flexDirection: isSmallScreen ? 'column' : 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        backgroundColor: '#1B9BBE',
        color: 'white',
        padding: '1rem',
      }}
    >
      {amounts.map((item, index) => (
        <CardContent
          key={index}
          sx={{
            textAlign: 'center',
            borderLeft: isSmallScreen && index !== 0 ? `2px solid ${theme.palette.primary.main}` : 'none',
            borderTop: !isSmallScreen && index !== 0 ? `2px solid ${theme.palette.primary.main}` : 'none',
            padding: '1rem',
            minWidth: 120,
          }}
        >
          <Typography variant="h6" gutterBottom>
            {item.label}
          </Typography>
          <Typography variant="body1">{item.value}</Typography>
        </CardContent>
      ))}
    </Card>
  );
};

export default RowOfAmounts;
