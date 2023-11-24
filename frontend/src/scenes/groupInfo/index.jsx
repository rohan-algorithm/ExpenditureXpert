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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
} from '@mui/material';
import { useLocation } from 'react-router-dom';

const GroupInfo = () => {
  const [group, setGroup] = useState(null);
  const [loading, setLoading] = useState(true);
  const [friendList, setFriendList] = useState([]);
  const [selectedFriendId, setSelectedFriendId] = useState('');
  const [amountToTake, setAmountToTake] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const theme = useTheme();
  const location = useLocation();
  const { groupId } = location.state;
  const uid = sessionStorage.getItem('id');

  const fetchGroupInfo = async () => {
    try {
      const response = await axios.get(`http://localhost:5001/api/v6/getGroupInfo/${groupId}`);
      setGroup(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching group info:', error);
      setLoading(false);
    }
  };

  const fetchFriendList = async () => {
    try {
      const response = await axios.get(`http://localhost:5001/api/v3/get-friends/${uid}`);
      setFriendList(response.data.friends);
    } catch (error) {
      console.error('Error fetching friend list:', error);
    }
  };

  const handleAddFriend = async () => {
    try {
      const response = await axios.post(`http://localhost:5001/api/v6/sendGroupInvitation`, {
        userId: uid,
        invitedUserId: selectedFriendId,
        groupId: groupId,
        amt: amountToTake,
      });
      // setGroup(response.data.friends);
      setOpenDialog(false);
      setSelectedFriendId('');
      setAmountToTake('');
    } catch (error) {
      console.error('Error adding friend to group:', error);
    }
  };

  useEffect(() => {
    fetchGroupInfo();
    fetchFriendList();
  }, []);

  return (
    <>
     <Button variant="contained" color="primary" onClick={() => setOpenDialog(true)}>Add Friend to Group</Button>
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Add Friend to Group</DialogTitle>
        <DialogContent>
          <Select
            label="Select Friend"
            value={selectedFriendId}
            onChange={(e) => setSelectedFriendId(e.target.value)}
            fullWidth
          >
            {friendList.map((friend) => (
              <MenuItem key={friend.id} value={friend.id}>{friend.name}</MenuItem>
            ))}
          </Select>
          <TextField
            label="Amount to Take"
            type="number"
            value={amountToTake}
            onChange={(e) => setAmountToTake(e.target.value)}
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button onClick={handleAddFriend} variant="contained" color="primary">Add</Button>
        </DialogActions>
      </Dialog>
      <h2>{group ? `Group: ${group.name.toUpperCase()}` : 'Group Information'}</h2>
      {loading ? (
        <CircularProgress />
      ) : group ? (
        <div style={{ display: 'flex', justifyContent: 'center' }}>
        <TableContainer component={Paper}sx={{
          width: "80%",
          // // maxWidth: 360,
          // bgcolor: theme.palette.primary[700],
          // borderRadius: "8px",
        }}>
          <Table >
            <TableHead>
              <TableRow style={{ backgroundColor: theme.palette.primary[700], color: theme.palette.primary.contrastText }}>
                <TableCell>Member Name</TableCell>
                <TableCell>Split Amount</TableCell>
              </TableRow>
            </TableHead>
            <TableBody style={{ backgroundColor: theme.palette.primary[500], color: theme.palette.primary.contrastText }}>
              {group.members.map((member) => (
                <TableRow key={member.userId}>
                  <TableCell>{member.memberName}</TableCell>
                  <TableCell>₹ {member.amountOwed}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        </div>
      ) : (
        <p>No data available for this group.</p>
      )}
     
    </>
  );
};

export default GroupInfo;
