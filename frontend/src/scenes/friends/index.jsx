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
  Button,
  TextField,
  Box,
} from '@mui/material';
import Header from 'component/Header';

const FriendList = () => {
  const [friends, setFriends] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const theme = useTheme();

  useEffect(() => {
    fetchFriends();
  }, [currentPage]);

  const fetchFriends = async () => {
    try {
      const id = sessionStorage.getItem('id');
      const response = await axios.get(`http://localhost:5001/api/v3/get-friends/${id}`, {
        params: {
          page: currentPage,
          limit: 20,
        },
      });
      console.log(response.data.friends);
      setFriends(response.data.friends);
      setTotalPages(Math.ceil(response.data.totalFriends / 20));
      setLoading(false);
    } catch (error) {
      console.error('Error fetching friends:', error);
      setLoading(false);
    }
  };

  const handleNextPage = () => {
    setCurrentPage((prevPage) => (prevPage < totalPages ? prevPage + 1 : prevPage));
  };

  const handlePrevPage = () => {
    setCurrentPage((prevPage) => (prevPage > 1 ? prevPage - 1 : prevPage));
  };
  const [newFriendEmail, setNewFriendEmail] = useState('');
  const [addingFriend, setAddingFriend] = useState(false);

  const handleAddFriend = async () => {
    try {
      setAddingFriend(true);
      const id = sessionStorage.getItem('id');
      await axios.post(`http://localhost:5001/api/v3/add-friend/${id}`, { email: newFriendEmail});
      setNewFriendEmail('');
      // Refetch friends data or update state to display the newly added friend
      fetchFriends();
    } catch (error) {
      console.error('Error adding friend:', error);
    } finally {
      setAddingFriend(false);
    }
  };


  return (
    <>
      <Header title="Friends" subtitle="Entire list of Friends" />
      {/* Form for adding a friend */}
      <Box diisplay="flex" alignItems="center" justifyContent="center" height="10vh">
        <TextField
          label="Friend's Email"
          value={newFriendEmail}
          onChange={(e) => setNewFriendEmail(e.target.value)}
          sx={{ mr: 5 }}
        />
        <Button
          onClick={handleAddFriend}
          disabled={addingFriend || newFriendEmail.trim() === ''}
          sx={{
            backgroundColor: '#1976D2',
            color: 'white',
            '&:hover': {
              backgroundColor: '#115293',
            },
            '&:disabled': {
              backgroundColor: '#CCCCCC',
              color: 'rgba(255, 255, 255, 0.7)',
              cursor: 'not-allowed',
            },
          }}
        >
          Add Friend
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
        <TableHead>
            <TableRow style={{ backgroundColor: theme.palette.primary.main, color: theme.palette.primary.contrastText }}>
              <TableCell>Friend Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Debit Amount</TableCell>
              <TableCell>Credit Amount</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={4} align="center">
                  <CircularProgress />
                </TableCell>
              </TableRow>
            ) : (
              friends.map((friend) => (
                <TableRow key={friend._id}>
                  <TableCell>{friend.name}</TableCell>
                  <TableCell>{friend.email}</TableCell>
                  <TableCell>₹ {friend.amountOwed }</TableCell>
                  <TableCell>₹ {friend.amountLent}</TableCell>
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

export default FriendList;
