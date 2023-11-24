import React, { useState, useEffect } from "react";
import axios from 'axios';
import {
  LightModeOutlined,
  DarkModeOutlined,
  Menu as MenuIcon,
  Search,
  SettingsOutlined,
  NotificationsOutlined,
} from "@mui/icons-material";
import {
  AppBar,
  IconButton,
  Toolbar,
  Box,
  Typography,
  InputBase,
  Button,
  Popover,
  List,
  ListItem,
} from "@mui/material";
import { useDispatch } from "react-redux";
import { setMode } from "state";
import profileImage from "assets/profileImage.png";

const Navbar = ({ userId, isSidebarOpen, setIsSidebarOpen }) => {
  const dispatch = useDispatch();
  const [friendRequests, setFriendRequests] = useState([]);
  const [groupRequests, setGroupRequests] = useState([]);
  const [anchorElNotification, setAnchorElNotification] = useState(null);
  const uid= sessionStorage.getItem("id");
  useEffect(() => {
    const fetchFriendRequests = async () => {
      try {
        const response = await axios.get(`http://localhost:5001/api/v3/available-requests/${uid}`);

        // console.log(response.data);
        setFriendRequests(response.data);
      } catch (error) {
        console.error('Error fetching friend requests:', error);
      }
    };

    const interval = setInterval(() => {
      fetchFriendRequests();
    }, 5000);

    return () => clearInterval(interval);
  }, [userId]);

  //Group Req
  useEffect(() => {
    const fetchGroupRequests = async () => {
      try {
        
        const response = await axios.get(`http://localhost:5001/api/v6/pendingGroupsReq/${uid}`);

        console.log(response.data);
        setGroupRequests(response.data);
      } catch (error) {
        console.error('Error fetching friend requests:', error);
      }
    };

    const interval = setInterval(() => {
      fetchGroupRequests();
    }, 5000);

    return () => clearInterval(interval);
  }, [userId]);
  const handleNotificationClick = (event) => {
    setAnchorElNotification(event.currentTarget);
  };

  const handleNotificationClose = () => {
    setAnchorElNotification(null);
  };

  const handleConfirmRequest = async(requestId) => {
    try {
      // console.log("ye"+userId);
      const response = await axios.put(`http://localhost:5001/api/v3/confirm-friend/${requestId}/${uid}`); // Replace 'userId' with the actual ID of the logged-in user
      console.log(response.data.message); // Log the confirmation message
    } catch (error) {
      console.error('Error confirming friend request:', error);
      // Handle error states or show a message to the user that the confirmation failed
    }
    console.log(`Request ${requestId} confirmed.`);
  };
   const handleConfirmRequest1 = async(requestId) => {
    try {
      // console.log("ye"+userId);
      console.log(uid,requestId);
      const response = await axios.post(`http://localhost:5001/api/v6/acceptGroupRequest`, {
      
          userId: uid,
          groupId: requestId,
      }); // Replace 'userId' with the actual ID of the logged-in user
      console.log(response.data.message); // Log the confirmation message
    } catch (error) {
      console.error('Error confirming friend request:', error);
      // Handle error states or show a message to the user that the confirmation failed
    }
    console.log(`Request ${requestId} confirmed.`);
  };

  return (
    <AppBar position="static" style={{ background: "transparent", boxShadow: "none" }}>
      <Toolbar style={{ justifyContent: "space-between" }}>
        {/* Left Side */}
        <Box display="flex">
          <IconButton onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
            <MenuIcon />
          </IconButton>
          <Box bgcolor="#f5f5f5" borderRadius="9px" display="flex" alignItems="center" px="10px">
            <InputBase placeholder="Search..." />
            <IconButton>
              <Search />
            </IconButton>
          </Box>
        </Box>
      
        {/* Right Side */}
        <Box display="flex" alignItems="center">
          <IconButton onClick={() => dispatch(setMode())}>
            <DarkModeOutlined sx={{ fontSize: "25px" }} />
          </IconButton>
          <IconButton onClick={handleNotificationClick}>
            <NotificationsOutlined sx={{ fontSize: "25px" }} />
          </IconButton>
          <IconButton>
            <SettingsOutlined sx={{ fontSize: "25px" }} />
          </IconButton>
        </Box>

        {/* Notification Popover */}
        <Popover
          open={Boolean(anchorElNotification)}
          anchorEl={anchorElNotification}
          onClose={handleNotificationClose}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
        >
          <Box
            sx={{
              width: '300px',
              maxHeight: '300px',
              overflowY: 'auto',
            }}
          >
            <List>
              {friendRequests.map((request, index) => (
                <ListItem key={index} >
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                    <Typography variant="body5" sx={{ mr: 2 }}>{request.name}</Typography>
                    <Button
                      variant="contained"
                      color="primary"
                      size="small"
                      onClick={() => handleConfirmRequest(request._id)}
                    >
                      Confirm
                    </Button>
                  </Box>
                </ListItem>
              ))}
            </List>
            <List>
              {groupRequests.map((request, index) => (
                <ListItem key={index} >
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                    <Typography variant="body5" sx={{ mr: 2 }}>{request.name}</Typography>
                    <Typography variant="body5" sx={{ mr: 2 }}>{request.amt}</Typography>
                    <Button
                      variant="contained"
                      color="primary"
                      size="small"
                      onClick={() => handleConfirmRequest1(request.groupId)}
                    >
                      Confirm
                    </Button>
                  </Box>
                </ListItem>
              ))}
            </List>
          </Box>
        </Popover>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;



