import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import axios from "axios";
import {
  useTheme,
  CircularProgress,
  List,
  ListItem,
  Dialog,
  DialogTitle,
  DialogContent,
  Button,
  DialogContentText,
  DialogActions,
  TextField,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Box, // Import Box component for layout
} from "@mui/material";

const CreateGroupPopup = ({ open, handleClose, handleCreateGroup }) => {
  const [groupName, setGroupName] = useState("");

  const handleCreate = () => {
    // Call a function passed down from the parent component to handle group creation
    handleCreateGroup(groupName);
    setGroupName(""); // Reset the input after creating the group
    handleClose();
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Create a Group</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Enter a name for your new group.
        </DialogContentText>
        <TextField
          autoFocus
          margin="dense"
          label="Group Name"
          fullWidth
          value={groupName}
          onChange={(e) => setGroupName(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="secondary">
          Cancel
        </Button>
        <Button onClick={handleCreate} color="primary" variant="contained">
          Create
        </Button>
      </DialogActions>
    </Dialog>
  );
};


const GroupList = () => {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const theme = useTheme();
  const uid = sessionStorage.getItem("id");
  const [openCreateGroup, setOpenCreateGroup] = useState(false);

  const handleCreateGroupClick = () => {
    setOpenCreateGroup(true);
  };

  const handleCloseCreateGroup = () => {
    setOpenCreateGroup(false);
  };

  const handleCreateGroup = async(groupName) => {
    // Perform group creation logic here (e.g., API call, state update)
    try {
      const response = await axios.post(`http://localhost:5001/api/v6/createGroup`, {
        userId: uid,
        name:groupName
      });
      // setGroup(response.data.friends);
      // setOpenDialog(false);
      // setSelectedFriendId('');
      // setAmountToTake('');
    } catch (error) {
      console.error('Error Creating a Group', error);
    }
    console.log(`Creating group with name: ${groupName}`);
  };
  useEffect(() => {
    fetchGroups();
  }, []);

  const fetchGroups = async () => {
    try {
      const id = sessionStorage.getItem("id");
      const response = await axios.get(
        `http://localhost:5001/api/v6/getExpenses/${id}`
      );
      setGroups(response.data.groups);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching groups:", error);
      setLoading(false);
    }
  };

  const handleItemClick = (groupId) => {
    console.log(`Clicked group with ID: ${groupId}`);
    navigate(`/groupinfo/${groupId}`, { state: { groupId } });

  };

  return (
    <Box>
    
     <div style={{ display: 'flex', justifyContent: 'center' }}>
      <Box width="30%">
        <h2>My Groups</h2>
        <Button variant="contained" onClick={handleCreateGroupClick}>
        Create Group
      </Button>
      
      <CreateGroupPopup
        open={openCreateGroup}
        handleClose={handleCloseCreateGroup}
        handleCreateGroup={handleCreateGroup}
      />
         <Box marginTop={2}>
         {/* Space */}
        </Box> 
        {loading ? (
          <CircularProgress />
        ) : (
          <Box display="flex" justifyContent="center">
            <List
              sx={{
                width: "100%",
                // maxWidth: 360,
                bgcolor: theme.palette.primary[700],
                borderRadius: "8px",
              }}
            >
              {groups.map((group) => (
                <ListItem
                  key={group._id}
                  onClick={() => handleItemClick(group._id)}
                  // sx={{ marginBottom: 2 }}
                >
                  <ListItemAvatar>
                    <Avatar>{/* Replace with appropriate icon */}</Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={group.name.toUpperCase()}
                    // secondary={`Members: ${group.members.join(", ")}`}
                  />
                </ListItem >
                
              ))}
            </List>
          </Box>
        )}
      </Box>
      </div>
    </Box>
  );
};

export default GroupList;





