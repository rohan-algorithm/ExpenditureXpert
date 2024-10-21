import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  useTheme,
  Box,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Grid,
  IconButton,
}  from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { DesktopDatePicker, DesktopTimePicker } from '@mui/x-date-pickers';
import { DataGrid } from '@mui/x-data-grid';

import Header from 'component/Header';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import DataGridCustomToolbar from 'component/DataGridCustomToolbar';
import { toast ,ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ExpenseTable = ({ dash }) => {
  const theme = useTheme();
  const [expenses, setExpenses] = useState([]);
  const [newExpense, setNewExpenses] = useState();
  const [loading, setLoading] = useState(true);
  const [selectedExpense, setSelectedExpense] = useState(null);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(20);
  const [sort, setSort] = useState({});
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [totalPages, setTotalPages] = useState(1);
  const [open, setOpen] = useState(false);

  let id = sessionStorage.getItem("id");

  const categories = ['Food', 'Transportation', 'Utilities', 'Others'];

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setNewExpenses((prevExpense) => ({
      ...prevExpense,
      [name]: value,
    }));
  };

  const handleDateChange = (date) => {
    setNewExpenses((prevExpense) => ({
      ...prevExpense,
      date,
    }));
  };

  const handleTimeChange = (time) => {
    setNewExpenses((prevExpense) => ({
      ...prevExpense,
      time,
    }));
  };

  const handleAddExpense = (e) => {
    e.preventDefault();
  
  // Convert 'amount' to a number type if it's supposed to be a number
  const newExpenseConverted = {
    name: newExpense.name,
    amount: parseFloat(newExpense.amount), // Attempt to parse the string to a float number
    category: newExpense.category,
    date: newExpense.date,
    time: newExpense.time,
    id:id,
  }
  

    axios.post('http://localhost:5001/api/v2/addExpanse', newExpenseConverted)
    .then(response => {
      console.log('Data sent to the server:', response.data);
      const newExpenseWithId = { ...response.data.expanse, id: response.data.expanse._id };
      toast.success('Expense added successfully');
      setExpenses(prevExpenses => [...prevExpenses, newExpenseWithId]);
      fetchData();
    })
    .catch(error => {
      console.error('Error while sending data:', error);
      // Handle errors here
    });

    handleClose();
  };
  const fetchData = async () => {
    try {
      const id = sessionStorage.getItem('id');
      const response = await axios.get(`http://localhost:5001/api/v2/getExpenses/${id}`, {
        params: {
          page: page + 1,
          limit: pageSize,
          sort: JSON.stringify(sort),
          search,
        },
      });
      setExpenses(response.data.expenses);
      setTotalPages(Math.ceil(response.data.totalExpenses / pageSize));
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setLoading(false);
    }
  };

  const handleDeleteExpense = async (id) => {
    try {
      const response = await axios.delete(`http://localhost:5001/api/v2/deleteExpense/${id}`);
      if (response.status === 200) {
        toast.success('Expense deleted successfully');
        setExpenses((prevExpenses) => prevExpenses.filter((expense) => expense._id !== id));
      }
    } catch (error) {
      console.error('Error deleting expense:', error);
    }
  };

  const handleEditExpense = (expenses) => {
    setSelectedExpense(expenses);
    setOpenEditDialog(true);
  };

  const handleCloseEditDialog = () => {
    setSelectedExpense(null);
    setOpenEditDialog(false);
  };

  const handleUpdateExpense = async () => {
    try {
      await axios.put(`http://localhost:5001/api/v2/updateExpense/${selectedExpense._id}`, selectedExpense);
      setOpenEditDialog(false);
      setSelectedExpense(null);
      fetchData();
    } catch (error) {
      console.error('Error updating expense:', error);
    }
  };

  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setSelectedExpense({ ...selectedExpense, [name]: value });
  };

  const columns = [
    { field: 'name', headerName: 'Expense Name', flex: 1 },
    { field: 'amount', headerName: 'Amount', flex: 1, renderCell: (params) => `₹ ${params.value}` },
    { field: 'date', headerName: 'Date', flex: 1, renderCell: (params) => new Date(params.value).toLocaleDateString() },
    { field: 'time', headerName: 'Time', flex: 1, renderCell: (params) => new Date(params.value).toLocaleTimeString() },
    { field: 'category', headerName: 'Category', flex: 1 },
    {
      field: 'actions',
      headerName: 'Actions',
      flex: 1,
      sortable: false,
      renderCell: (params) => (
        <>
          <IconButton onClick={() => handleEditExpense(params.row)}>
            <EditIcon />
          </IconButton>
          <IconButton onClick={() => handleDeleteExpense(params.row._id)}>
            <DeleteIcon />
          </IconButton>
        </>
      ),
    },
  ];

  useEffect(() => {
    fetchData();
  }, []);


  return (
    <Box m="0.5rem 0.5rem">
      {dash.is === '1' && (
        
        <>
          <Header title="TRANSACTIONS" subtitle="Entire list of transactions" />
          <Box height="6vh">
          <Button variant="contained" onClick={handleOpen}>
        Add Expense
      </Button>
      <ToastContainer />
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Add Expense</DialogTitle>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                label="Name"
                name="name"
                value={expenses.name}
                onChange={handleInputChange}
                fullWidth
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Amount"
                name="amount"
                value={expenses.amount}
                onChange={handleInputChange}
                fullWidth
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel id="category-label">Category</InputLabel>
                <Select
                  labelId="category-label"
                  value={expenses.category}
                  onChange={handleInputChange}
                  name="category"
                >
                  {categories.map((cat) => (
                    <MenuItem key={cat} value={cat}>
                      {cat}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={6}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DesktopDatePicker
                  label="Date"
                  value={expenses.date}
                  onChange={handleDateChange}
                  renderInput={(params) => <TextField {...params} fullWidth />}
                />
              </LocalizationProvider>
            </Grid>
            <Grid item xs={6}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DesktopTimePicker
                  label="Time"
                  value={expenses.time}
                  onChange={handleTimeChange}
                  renderInput={(params) => <TextField {...params} fullWidth />}
                />
              </LocalizationProvider>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleAddExpense} variant="contained" color="primary">
            Add
          </Button>
        </DialogActions>
      </Dialog>
          </Box>
        </>
      )}
 
      <Dialog open={openEditDialog} onClose={handleCloseEditDialog}>
        <DialogTitle>Edit Expense</DialogTitle>
        <DialogContent>
          <TextField
            name="name"
            label="Expense name"
            value={selectedExpense ? selectedExpense.name : ''}
            onChange={handleEditInputChange}
            fullWidth
            margin="normal"
          />
          <TextField
            name="amount"
            label="Amount"
            value={selectedExpense ? selectedExpense.amount : ''}
            onChange={handleEditInputChange}
            fullWidth
            margin="normal"
          />
          <TextField
            name="date"
            label="Date"
            value={selectedExpense ? selectedExpense.date : ''}
            onChange={handleEditInputChange}
            fullWidth
            margin="normal"
          />
          <TextField
            name="time"
            label="Time"
            value={selectedExpense ? selectedExpense.time : ''}
            onChange={handleEditInputChange}
            fullWidth
            margin="normal"
          />
          <TextField
            name="category"
            label="Category"
            value={selectedExpense ? selectedExpense.category : ''}
            onChange={handleEditInputChange}
            fullWidth
            margin="normal"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseEditDialog}>Cancel</Button>
          <Button onClick={handleUpdateExpense}>Update</Button>
        </DialogActions>
      </Dialog>
      <Box
        height="80vh"
        sx={{
          "& .MuiDataGrid-root": {
            border: "none",
          },
          "& .MuiDataGrid-cell": {
            borderBottom: "none",
          },
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: theme.palette.background.alt,
            color: theme.palette.secondary[100],
            borderBottom: "none",
          },
          "& .MuiDataGrid-virtualScroller": {
            backgroundColor: theme.palette.primary.light,
          },
          "& .MuiDataGrid-footerContainer": {
            backgroundColor: theme.palette.background.alt,
            color: theme.palette.secondary[100],
            borderTop: "none",
          },
          "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
            color: `${theme.palette.secondary[200]} !important`,
          },
        }}
      >
        <DataGrid
          loading={loading}
          getRowId={(row) => row._id}
          rows={expenses}
          columns={columns}
          rowCount={totalPages * pageSize}
          rowsPerPageOptions={[20, 50, 100]}
          pagination
          page={page}
          pageSize={pageSize}
          paginationMode="server"
          sortingMode="server"
          onPageChange={(newPage) => setPage(newPage)}
          onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
          onSortModelChange={(newSortModel) => setSort(...newSortModel)}
          components={{ Toolbar: DataGridCustomToolbar }}
          componentsProps={{
            toolbar: { searchInput, setSearchInput, setSearch },
          }}
        />
      </Box>
    </Box>
  );
};

export default ExpenseTable;