import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
  Table,
  TableContainer,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Paper,
  InputLabel,
  CircularProgress,
  Button,
  Dialog,
  Grid,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  Checkbox,
  FormControlLabel,
  FormControl,
  FormLabel,
  RadioGroup,
  Radio,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Typography,
  Box,
} from '@mui/material';
import { useTheme } from '@mui/system';
import { useLocation } from 'react-router-dom';

const GroupInfo = () => {
  const theme = useTheme();
  const [group, setGroup] = useState(null);
  const [loading, setLoading] = useState(true);
  const [friendList, setFriendList] = useState([]);
  const [selectedFriendId, setSelectedFriendId] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [openTransactionDialog, setOpenTransactionDialog] = useState(false);
  const [payerId, setPayerId] = useState('');
  const [amountPaid, setAmountPaid] = useState();
  const [selectedFriends, setSelectedFriends] = useState([]);
  const [splitType, setSplitType] = useState('equal');
  const [customAmounts, setCustomAmounts] = useState({});
  const [simplifiedTransactions, setSimplifiedTransactions] = useState([]);
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
      await axios.post(`http://localhost:5001/api/v6/sendGroupInvitation`, {
        userId: uid,
        invitedUserId: selectedFriendId,
        groupId: groupId,
      });
      setOpenDialog(false);
      setSelectedFriendId('');
      fetchGroupInfo(); // Refresh group info after adding a friend
    } catch (error) {
      console.error('Error adding friend to group:', error);
    }
  };

  const simplifyDebts = (members) => {
    const balances = {};

    // Calculate net balance for each member
    members.forEach((member) => {
      balances[member.userId] = (balances[member.userId] || 0) + member.amount;
    });

    const creditors = [];
    const debtors = [];

    // Separate creditors and debtors
    for (const [userId, balance] of Object.entries(balances)) {
      const member = members.find((m) => m.userId === userId);
      if (balance > 0) {
        creditors.push({ userId, memberName: member.memberName, balance });
      } else if (balance < 0) {
        debtors.push({ userId, memberName: member.memberName, balance: -balance });
      }
    }

    const transactions = [];

    // Simplify debts
    while (creditors.length && debtors.length) {
      const creditor = creditors.pop();
      const debtor = debtors.pop();

      const amount = Math.min(creditor.balance, debtor.balance);
      transactions.push({
        from: debtor.memberName,
        to: creditor.memberName,
        amount,
      });

      creditor.balance -= amount;
      debtor.balance -= amount;

      if (creditor.balance > 0) creditors.push(creditor);
      if (debtor.balance > 0) debtors.push(debtor);
    }

    return transactions;
  };

  const handleSimplifyDebts = () => {
    if (group) {
      const transactions = simplifyDebts(group.members);
      setSimplifiedTransactions(transactions);
    }
  };

  const handleAddTransaction =  async () => {
    if (splitType === 'custom') {
      // Calculate the sum of custom amounts
      const totalCustomAmount = selectedFriends.reduce((total, friendId) => {
        return total + (parseFloat(customAmounts[friendId]) || 0)
      }, 0);
      // console.log(totalCustomAmount, amountPaid);
      if (totalCustomAmount !== parseFloat(amountPaid)) {
        toast.error(`The total custom amounts (${totalCustomAmount}) must equal the amount paid (${amountPaid}).`, {
          position: "top-right",
          autoClose: 5000, 
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        return; // Exit early if the total custom amounts do not match the amount paid
      }
    }

   
    try {
      const updatedGroup = { ...group };
      const payer = updatedGroup.members.find(member => member.userId === payerId);
      // payer.amount += parseFloat(amountPaid);
  
      if (splitType === 'equal') {
        const splitAmount = parseFloat(amountPaid) / selectedFriends.length;
        selectedFriends.forEach(friendId => {
          const friend = updatedGroup.members.find(member => member.userId === friendId);
          friend.amount -= splitAmount;
        });
      } else {
        selectedFriends.forEach(friendId => {
          const friend = updatedGroup.members.find(member => member.userId === friendId);
          friend.amount -= parseFloat(customAmounts[friendId]);
        });
      }
  
      await axios.post(`http://localhost:5001/api/v6/addTransaction`, {
        groupId: groupId,
        payerId: payerId,
        payerName: payer.memberName,
        amountPaid: amountPaid,
        selectedFriends: selectedFriends,
        customAmounts: splitType === 'custom' ? customAmounts : null,
      });
  
      setGroup(updatedGroup);
      setOpenTransactionDialog(false);
      setPayerId('');
      setAmountPaid('');
      setSelectedFriends([]);
      setCustomAmounts({});
      fetchGroupInfo(); // Refresh group info after adding a transaction
    } catch (error) {
      toast.error(`Error on adding transaction (${error}) `, {
        position: "top-right",
        autoClose: 5000, 
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
    toast.success('Transaction added successfully!', {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });

    // Your existing logic for submitting the transaction
    console.log('Transaction added successfully!');
    setOpenTransactionDialog(false);
  };

  useEffect(() => {
    fetchGroupInfo();
    fetchFriendList();
  }, []);

  const totalExpense = group ? group.balance : 0;

  return (
    <div className="container mx-auto p-4">
       <ToastContainer />
      <h2 className="text-xl font-bold mb-4" style={{ color: theme.palette.text.primary }}>{group ? `Group: ${group.name.toUpperCase()}` : 'Group Information'}</h2>

      <h4 className="text-2xl font-bold mb-4" style={{ color: theme.palette.text.primary }}>
        Total Expense: ₹ {totalExpense}
      </h4>
      <button
        className="px-4 py-2 rounded mb-4"
        style={{ backgroundColor: theme.palette.primary[700], color: theme.palette.primary.contrastText }}
        onClick={() => setOpenDialog(true)}
      >
        Add Friend to Group
      </button>
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle style={{ backgroundColor: theme.palette.primary[700], color: theme.palette.primary.contrastText }}>
          Add Friend to Group
        </DialogTitle>
        <DialogContent className="bg-blue-50">
          <InputLabel id="friend-select-label">Select Friend</InputLabel>
          <Select
            labelId="friend-select-label"
            value={selectedFriendId}
            onChange={(e) => setSelectedFriendId(e.target.value)}
            fullWidth
            className="mb-4 mt-4"
          >
            {friendList.map((friend) => (
              <MenuItem key={friend.id} value={friend.id}>
                {friend.name}
              </MenuItem>
            ))}
          </Select>
        </DialogContent>
        <DialogActions className="bg-gray-100">
          <button onClick={() => setOpenDialog(false)} className="px-4 py-2 rounded" style={{ backgroundColor: theme.palette.secondary[700], color: theme.palette.secondary.contrastText }}>
            Cancel
          </button>
          <button onClick={handleAddFriend} className="px-4 py-2 rounded" style={{ backgroundColor: theme.palette.primary[700], color: theme.palette.primary.contrastText }}>
            Add
          </button>
        </DialogActions>
      </Dialog>
      <button
        className="px-4 py-2 rounded mb-4 ml-4 m-4"
        style={{ backgroundColor: theme.palette.secondary[500], color: theme.palette.secondary.contrastText }}
        onClick={() => setOpenTransactionDialog(true)}
      >
        Add Transaction
      </button>
      <Dialog open={openTransactionDialog} onClose={() => setOpenTransactionDialog(false)}>
        <DialogTitle style={{ backgroundColor: theme.palette.primary[700], color: theme.palette.primary.contrastText }}>
          Add Transaction
        </DialogTitle>
        <DialogContent className="bg-blue-50">
          <Select
            label="Who Paid?"
            value={payerId}
            onChange={(e) => setPayerId(e.target.value)}
            fullWidth
            className="mb-4 mt-4"
          >
            {group && group.members.map((member) => (
              <MenuItem key={member.userId} value={member.userId}>
                {member.memberName}
              </MenuItem>
            ))}
          </Select>
          <TextField
            label="Amount Paid"
            type="number"
            value={amountPaid}
            onChange={(e) => setAmountPaid(e.target.value)}
            fullWidth
            className="mb-4"
          />
          <div>
            {group && group.members.map((member) => (
              <FormControlLabel
                key={member.userId}
                control={
                  <Checkbox
                    checked={selectedFriends.includes(member.userId)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedFriends([...selectedFriends, member.userId]);
                      } else {
                        setSelectedFriends(selectedFriends.filter(id => id !== member.userId));
                      }
                    }}
                  />
                }
                label={member.memberName}
              />
            ))}
          </div>
          <FormControl component="fieldset" className="mt-4">
            <FormLabel component="legend">Split Type</FormLabel>
            <RadioGroup
              row
              value={splitType}
              onChange={(e) => setSplitType(e.target.value)}
            >
              <FormControlLabel value="equal" control={<Radio />} label="Equal Split" />
              <FormControlLabel value="custom" control={<Radio />} label="Custom Amounts" />
            </RadioGroup>
          </FormControl>
          {splitType === 'custom' && (
            <div>
              {selectedFriends.map((friendId) => (
                <TextField
                  key={friendId}
                  label={`Amount for ${group.members.find(member => member.userId === friendId).memberName}`}
                  type="number"
                  value={customAmounts[friendId] || ''}
                  onChange={(e) => setCustomAmounts({ ...customAmounts, [friendId]: e.target.value })}
                  fullWidth
                  className="mb-4"
                />
              ))}
            </div>
          )}
        </DialogContent>
        <DialogActions className="bg-gray-100">
          <button onClick={() => setOpenTransactionDialog(false)} className="px-4 py-2 rounded" style={{ backgroundColor: theme.palette.secondary[700], color: theme.palette.secondary.contrastText }}>
            Cancel
          </button>
          <button onClick={handleAddTransaction} className="px-4 py-2 rounded" style={{ backgroundColor: theme.palette.primary[700], color: theme.palette.primary.contrastText }}>
            Add Transaction
          </button>
        </DialogActions>
      </Dialog>
      {loading ? (
        <CircularProgress style={{ color: theme.palette.primary[700] }} />
      ) : group ? (
        <div className="flex flex-col items-center">
          <List className="w-full bg-blue-50 mb-4">
            <Grid container spacing={2}>
              {group.members.map((member) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={member.userId}>
                  <ListItem className="flex flex-row">
                    <ListItemAvatar>
                      <Avatar>{member.memberName.charAt(0)}</Avatar>
                    </ListItemAvatar>
                    <ListItemText primary={member.memberName} secondary={`Current: ₹ ${member.amount}`} />
                  </ListItem>
                </Grid>
              ))}
            </Grid>
          </List>
          <TableContainer component={Paper} className="w-full bg-blue-50">
            <Table>
              <TableHead style={{ backgroundColor: theme.palette.primary[700] }}>
                <TableRow>
                  <TableCell style={{ color: theme.palette.primary.contrastText }}>Name</TableCell>
                  <TableCell style={{ color: theme.palette.primary.contrastText }}>Amount</TableCell>
                  <TableCell style={{ color: theme.palette.primary.contrastText }}>On</TableCell>
                </TableRow>
              </TableHead>
              <TableBody className="bg-gray-100">
                {group.history.map((transaction, index) => (
                  <TableRow key={index}>
                    <TableCell>{transaction.memberName}</TableCell>
                    <TableCell>{transaction.amountPaid}</TableCell>
                    <TableCell>{new Date(transaction.date).toLocaleString()}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      ) : (
        <p className="text-gray-500">No data available for this group.</p>
      )}
      {group && (
        <button
          className="px-4 py-2 rounded mt-4"
          style={{ backgroundColor: theme.palette.secondary[500], color: theme.palette.secondary.contrastText }}
          onClick={handleSimplifyDebts}
        >
          Simplify Debts
        </button>
      )}
      {simplifiedTransactions.length > 0 && (
        <div className="mt-8">
          <h3 className="text-lg font-bold mb-4" style={{ color: theme.palette.text.primary }}>Simplified Transactions</h3>
          <TableContainer component={Paper} className="w-full bg-blue-50">
            <Table>
              <TableHead style={{ backgroundColor: theme.palette.primary[700] }}>
                <TableRow>
                  <TableCell style={{ color: theme.palette.primary.contrastText }}>From</TableCell>
                  <TableCell style={{ color: theme.palette.primary.contrastText }}>To</TableCell>
                  <TableCell style={{ color: theme.palette.primary.contrastText }}>Amount</TableCell>
                </TableRow>
              </TableHead>
              <TableBody className="bg-gray-100">
                {simplifiedTransactions.map((transaction, index) => (
                  <TableRow key={index}>
                    <TableCell>{transaction.from}</TableCell>
                    <TableCell>{transaction.to}</TableCell>
                    <TableCell>₹ {transaction.amount}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      )}
    </div>
  );
};

export default GroupInfo;