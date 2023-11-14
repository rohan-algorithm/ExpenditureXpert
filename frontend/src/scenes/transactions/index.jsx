import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Box, useTheme } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import Dialog  from 'component/Dialog'

const Transactions = () => {
  const theme = useTheme();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('http://localhost:5001/create')
      .then(response => {
        setTransactions(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching transactions:', error);
        setLoading(false);
      });
  }, []);

  const columns = [
    { field: '_id', headerName: 'ID', flex: 1 },
    { field: 'userId', headerName: 'User ID', flex: 1 },
    { field: 'createdAt', headerName: 'CreatedAt', flex: 1 },
    { field: 'products', headerName: '# of Products', flex: 0.5, sortable: false },
    { field: 'cost', headerName: 'Cost', flex: 1, valueFormatter: ({ value }) => `$${Number(value).toFixed(2)}` },
  ];

  return (
    <Box m="1.5rem 2.5rem">
      {/* ... Header and other components */}
      <Box 
        height="80vh"
        className="marginButtom"
        sx={{
          "& .MuiDataGrid-root": { border: "none" },
          "& .MuiDataGrid-cell": { borderBottom: "none" },
          // ... other styles
        }}
      >
        <Dialog/>
        <DataGrid
          loading={loading}
          rows={transactions}
          columns={columns}
          pageSize={10}
          rowHeight={40}
          checkboxSelection={false}
          disableSelectionOnClick
          pagination
          paginationMode="server"
          sortingMode="server"
          // ... other props
        />
      </Box>
    </Box>
  );
};

export default Transactions;
