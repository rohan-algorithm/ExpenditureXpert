import React, { useState } from 'react';
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Grid,
} from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { DesktopDatePicker, DesktopTimePicker } from '@mui/x-date-pickers';
import axios from "axios";

let id = sessionStorage.getItem("id");
const AddExpensePopup = () => {
  const [open, setOpen] = useState(false);
  const [expense, setExpense] = useState({
    name: '',
    amount: '',
    category: '',
    date: null,
    time: null,
  });

  const categories = ['Food', 'Transportation', 'Utilities', 'Others'];

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setExpense((prevExpense) => ({
      ...prevExpense,
      [name]: value,
    }));
  };

  const handleDateChange = (date) => {
    setExpense((prevExpense) => ({
      ...prevExpense,
      date,
    }));
  };

  const handleTimeChange = (time) => {
    setExpense((prevExpense) => ({
      ...prevExpense,
      time,
    }));
  };

  const handleAddExpense = (e) => {
    e.preventDefault();
  
  // Convert 'amount' to a number type if it's supposed to be a number
  const newExpense = {
    name: expense.name,
    amount: parseFloat(expense.amount), // Attempt to parse the string to a float number
    category: expense.category,
    date: expense.date,
    time: expense.time,
    id:id,
  }
  

    axios.post('http://localhost:5001/api/v2/addExpanse', newExpense)
    .then(response => {
      console.log('Data sent to the server:', response.data);
      // Perform any necessary actions upon successful data submission
    })
    .catch(error => {
      console.error('Error while sending data:', error);
      // Handle errors here
    });

    handleClose();
  };

  return (
    <div>
      <Button variant="contained" onClick={handleOpen}>
        Add Expense
      </Button>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Add Expense</DialogTitle>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                label="Name"
                name="name"
                value={expense.name}
                onChange={handleInputChange}
                fullWidth
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Amount"
                name="amount"
                value={expense.amount}
                onChange={handleInputChange}
                fullWidth
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel id="category-label">Category</InputLabel>
                <Select
                  labelId="category-label"
                  value={expense.category}
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
                  value={expense.date}
                  onChange={handleDateChange}
                  renderInput={(params) => <TextField {...params} fullWidth />}
                />
              </LocalizationProvider>
            </Grid>
            <Grid item xs={6}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DesktopTimePicker
                  label="Time"
                  value={expense.time}
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
    </div>
  );
};

export default AddExpensePopup;
