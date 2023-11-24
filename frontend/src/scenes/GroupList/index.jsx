import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import axios from "axios";
import {
  useTheme,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Box, // Import Box component for layout
} from "@mui/material";

const GroupList = () => {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const theme = useTheme();

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
      <Box width="80%">
        <h2>My Groups</h2>
        {loading ? (
          <CircularProgress />
        ) : (
          <Box display="flex" justifyContent="center">
            <List
              sx={{
                width: "100%",
                maxWidth: 360,
                bgcolor: "background.paper",
                borderRadius: "12px",
              }}
            >
              {groups.map((group) => (
                <ListItem
                  key={group._id}
                  onClick={() => handleItemClick(group._id)}
                >
                  <ListItemAvatar>
                    <Avatar>{/* Replace with appropriate icon */}</Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={group.name}
                    secondary={`Members: ${group.members.join(", ")}`}
                  />
                </ListItem>
              ))}
            </List>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default GroupList;
