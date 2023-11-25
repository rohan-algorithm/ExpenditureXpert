import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  useTheme,
  Table,
  TableContainer,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Paper,
  CircularProgress,
  TextField,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Button,
} from '@mui/material';
import Header from 'component/Header';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AddExpense from '../../component/AddExpanse'; //
const ExpenseTable = ({ dash }) => {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedExpense, setSelectedExpense] = useState(null);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const theme = useTheme();

  const fetchUpdatedData = () => {
    fetchData(); // Fetch updated data
  };

  useEffect(() => {
    const interval = setInterval(fetchUpdatedData, 500); // Fetch data every 5 seconds (adjust as needed)
    return () => clearInterval(interval); // Clear interval on component unmount
  }, []);
  const fetchData = async () => {
    try {
      const id = sessionStorage.getItem('id');
      const response = await axios.get(`http://localhost:5001/api/v2/getExpenses/${id}`, {
        params: {
          page: currentPage,
          limit: 20,
        },
      });
      setExpenses(response.data.expenses);
      setTotalPages(Math.ceil(response.data.totalExpenses / 20));
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setLoading(false);
    }
  };

  const handleDeleteExpense = async (id) => {
    try {
      await axios.delete(`http://localhost:5001/api/v2/deleteExpense/${id}`);
      fetchData();
    } catch (error) {
      console.error('Error deleting expense:', error);
    }
  };

  const handleEditExpense = (expense) => {
    setSelectedExpense(expense);
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
  const handleNextPage = () => {
    setCurrentPage((prevPage) => (prevPage < totalPages ? prevPage + 1 : prevPage));
  };

  const handlePrevPage = () => {
    setCurrentPage((prevPage) => (prevPage > 1 ? prevPage - 1 : prevPage));
  };

  return (
    <>
  
        {dash.is === '1' && (
        <>
          <Header title="TRANSACTIONS" subtitle="Entire list of transactions" />
          <Box height="8vh">
            <AddExpense />
          </Box>
        </>
      )}
      <Dialog open={openEditDialog} onClose={handleCloseEditDialog} >
        <DialogTitle>Edit Expense</DialogTitle>
        <DialogContent>
          <TextField
            name="name"
            label="Expense name"
            value={selectedExpense ? selectedExpense.name : ''}
            onChange={handleEditInputChange}
          />
          <TextField
            name="amount"
            label="Amount"
            value={selectedExpense ? selectedExpense.amount : ''}
            onChange={handleEditInputChange}
          />
          <TextField
            name="date"
            label="Date"
            value={selectedExpense ? selectedExpense.date : ''}
            onChange={handleEditInputChange}
          />
          <TextField
            name="time"
            label="Time"
            value={selectedExpense ? selectedExpense.time : ''}
            onChange={handleEditInputChange}
          />
          <TextField
            name="category"
            label="Category"
            value={selectedExpense ? selectedExpense.category : ''}
            onChange={handleEditInputChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseEditDialog}>Cancel</Button>
          <Button onClick={handleUpdateExpense}>Update</Button>
        </DialogActions>
      </Dialog>
      <TableContainer  component={Paper} style={{ border: '2px solid', borderColor: 'white'}}>
        <Table style={{ backgroundColor: theme.palette.primary[900], color: theme.palette.primary[900] }}>
          <TableHead>
            <TableRow style={{ backgroundColor: theme.palette.primary[700], color: theme.palette.primary[900] }}>
              <TableCell>Expense name</TableCell>
              <TableCell>Amount</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Time</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  <CircularProgress />
                </TableCell>
              </TableRow>
            ) : (
              expenses.map((expense) => (
                <TableRow key={expense._id}>
                  <TableCell>{expense.name}</TableCell>
                  <TableCell>₹ {expense.amount}</TableCell>
                  <TableCell>{new Date(expense.date).toLocaleDateString()}</TableCell>
                  <TableCell>{new Date(expense.time).toLocaleTimeString()}</TableCell>
                  <TableCell>{expense.category}</TableCell>
                  <TableCell>
                    <IconButton onClick={() => handleEditExpense(expense)}>
                      <EditIcon />
                    </IconButton>
                    <IconButton onClick={() => handleDeleteExpense(expense._id)}>
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <div>
        <Button onClick={handlePrevPage} disabled={currentPage === 1}>
          Previous Page
        </Button>
        <Button onClick={handleNextPage} disabled={currentPage === totalPages}>
          Next Page
        </Button>
      </div>
    </>
  );
};

export default ExpenseTable;
