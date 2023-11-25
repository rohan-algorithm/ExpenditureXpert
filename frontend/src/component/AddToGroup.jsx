// components/AddToGroup.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useTheme, CircularProgress, Button, Select, MenuItem, InputLabel, FormControl } from '@mui/material';

const AddToGroup = ({ onAddToGroup }) => {
  const [friends, setFriends] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedFriend, setSelectedFriend] = useState('');
  const theme = useTheme();

  useEffect(() => {
    fetchFriends();
  }, []);

  const fetchFriends = async () => {
    try {
      const id = sessionStorage.getItem('id');
      const response = await axios.get(`http://localhost:5001/api/v3/friends/${id}`);
      setFriends(response.data.friends);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching friends:', error);
      setLoading(false);
    }
  };

  const handleAddToGroup = async () => {
    try {
      await onAddToGroup(selectedFriend);
    } catch (error) {
      console.error('Error adding friend to group:', error);
    }
  };

  return (
    <>
      <h2>Add Friend to Group</h2>
      {loading ? (
        <CircularProgress />
      ) : (
        <>
          <FormControl>
            <InputLabel id="select-friend-label">Select Friend</InputLabel>
            <Select
              labelId="select-friend-label"
              id="select-friend"
              value={selectedFriend}
              label="Select Friend"
              onChange={(e) => setSelectedFriend(e.target.value)}
            >
              {friends.map((friend) => (
                <MenuItem key={friend._id} value={friend._id}>
                  {friend.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Button
            onClick={handleAddToGroup}
            disabled={!selectedFriend}
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
            Add to Group
          </Button>
        </>
      )}
    </>
  );
};

export default AddToGroup;
