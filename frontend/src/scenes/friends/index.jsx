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
  Container,
} from '@mui/material';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Header from 'component/Header';

const FriendList = () => {
  const [friends, setFriends] = useState([]);
  const [loading, setLoading] = useState(true);
  const theme = useTheme();

  useEffect(() => {
    fetchFriends();
  }, []);

  const fetchFriends = async () => {
    try {
      const id = sessionStorage.getItem('id');
      const response = await axios.get(`http://localhost:5001/api/v3/get-friends/${id}`);
      setFriends(response.data.friends);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching friends:', error);
      setLoading(false);
      toast.error('Error fetching friends');
    }
  };

  const [newFriendEmail, setNewFriendEmail] = useState('');
  const [addingFriend, setAddingFriend] = useState(false);

  const handleAddFriend = async () => {
    try {
      setAddingFriend(true);
      const id = sessionStorage.getItem('id');
      await axios.post(`http://localhost:5001/api/v3/add-friend/${id}`, { email: newFriendEmail });
      setNewFriendEmail('');
      fetchFriends();
      toast.success('Friend added successfully');
    } catch (error) {
      console.error('Error adding friend:', error);
      toast.error('Error adding friend');
    } finally {
      setAddingFriend(false);
    }
  };

  return (
    <Container maxWidth="lg">
      <Header title="Friends" subtitle="Entire list of Friends" />
      <ToastContainer />
      <Box display="flex" alignItems="center" justifyContent="center" className="mt-4 mb-4">
        <TextField
          label="Friend's Email"
          value={newFriendEmail}
          onChange={(e) => setNewFriendEmail(e.target.value)}
          variant="outlined"
          className="mr-4"
          sx={{ marginRight: 2 }} // Add margin to the right
        />
        <Button
          onClick={handleAddFriend}
          disabled={addingFriend || newFriendEmail.trim() === ''}
          variant="contained"
          color="primary"
        >
          Add Friend
        </Button>
      </Box>

      <TableContainer component={Paper} className="shadow-lg">
        <Table>
          <TableHead>
            <TableRow style={{ backgroundColor: theme.palette.primary.main }}>
              <TableCell style={{ color: theme.palette.primary.contrastText }}>Friend Name</TableCell>
              <TableCell style={{ color: theme.palette.primary.contrastText }}>Email</TableCell>
              <TableCell style={{ color: theme.palette.primary.contrastText }}>Debit Amount</TableCell>
              <TableCell style={{ color: theme.palette.primary.contrastText }}>Credit Amount</TableCell>
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
                  <TableCell>₹ {friend.amountOwed}</TableCell>
                  <TableCell>₹ {friend.amountLent}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};

export default FriendList;