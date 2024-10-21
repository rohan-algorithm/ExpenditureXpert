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
  Box,
} from "@mui/material";

const CreateGroupPopup = ({ open, handleClose, handleCreateGroup }) => {
  const [groupName, setGroupName] = useState("");

  const handleCreate = () => {
    handleCreateGroup(groupName);
    setGroupName("");
    handleClose();
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Create a Group</DialogTitle>
      <DialogContent>
        <DialogContentText>Enter a name for your new group.</DialogContentText>
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

  const handleCreateGroup = async (groupName) => {
    try {
      await axios.post(`http://localhost:5001/api/v6/createGroup`, {
        userId: uid,
        name: groupName,
      });
      fetchGroups(); // Refresh the group list after creating a new group
    } catch (error) {
      console.error("Error Creating a Group", error);
    }
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
    navigate(`/groupinfo/${groupId}`, { state: { groupId } });
  };

  return (
    <Box className="flex justify-center items-center min-h-screen" style={{ backgroundColor: theme.palette.background.default }}>
      <Box
        className="w-full max-w-md p-4 rounded-lg shadow-md"
        style={{ backgroundColor: theme.palette.background.alt }}
      >
        <h2 className="text-2xl font-bold mb-4 text-center" style={{ color: theme.palette.text.primary }}>
          My Groups
        </h2>
        <Button
          variant="contained"
          onClick={handleCreateGroupClick}
          className="w-full mb-4"
          style={{ backgroundColor: theme.palette.primary.main, color: theme.palette.primary.contrastText }}
        >
          Create Group
        </Button>

        <CreateGroupPopup
          open={openCreateGroup}
          handleClose={handleCloseCreateGroup}
          handleCreateGroup={handleCreateGroup}
        />

        {loading ? (
          <Box className="flex justify-center">
            <CircularProgress style={{ color: theme.palette.primary.main }} />
          </Box>
        ) : (
          <List>
            {groups.map((group) => (
              <ListItem
                key={group._id}
                onClick={() => handleItemClick(group._id)}
                className="cursor-pointer hover:bg-gray-200 rounded-lg mb-2"
                style={{ backgroundColor: theme.palette.background.default }}
              >
                <ListItemAvatar>
                  <Avatar src={`https://ui-avatars.com/api/?name=${group.name}`} />
                </ListItemAvatar>
                <ListItemText
                  primary={group.name.toUpperCase()}
                  secondary={`Members: ${group.members.map(member => member.memberName).join(", ")}`}
                  primaryTypographyProps={{ style: { color: theme.palette.text.primary } }}
                  secondaryTypographyProps={{ style: { color: theme.palette.text.secondary } }}
                />
              </ListItem>
            ))}
          </List>
        )}
      </Box>
    </Box>
  );
};

export default GroupList;