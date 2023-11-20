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
  InputBase,
  Toolbar,
  Box,
  Typography,
  useTheme,
  Button,
} from "@mui/material";
import { useDispatch } from "react-redux";
import { setMode } from "state";
const Navbar = ({ userId,isSidebarOpen, setIsSidebarOpen }) => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const [showFriendRequests, setShowFriendRequests] = useState(false);
  const [friendRequests, setFriendRequests] = useState([]);
  const [showNotification, setShowNotification] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const isOpen = Boolean(anchorEl);
   
  const user = sessionStorage.getItem('id');
  // console.log(user);
  useEffect(() => {
    const fetchPendingRequests = async () => {
      try {
        const response = await axios.get(`http://localhost:5001/api/v3/available-requests/${user}`);
        setFriendRequests(response.data);
      } catch (error) {
        console.error('Error fetching pending requests:', error);
      }
    };

    const interval = setInterval(() => {
      fetchPendingRequests();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const handleFriendRequestsClick = () => {
    setShowFriendRequests(!showFriendRequests);
    setShowNotification(false);
  };

  const handleConfirmRequest = async(requestId) => {
    try {
      console.log("ye"+userId);
      const response = await axios.put(`http://localhost:5001/api/v3/confirm-friend/${requestId}/${user}`); // Replace 'userId' with the actual ID of the logged-in user
      console.log(response.data.message); // Log the confirmation message
      // You can also update the state or perform other actions after confirming the friend request
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
          <Box bgcolor={theme.palette.background.alt} borderRadius="9px" display="flex" alignItems="center" px="10px">
            <InputBase placeholder="Search..." />
            <IconButton>
              <Search />
            </IconButton>
          </Box>
        </Box>

        {/* Right Side */}
        <Box display="flex" alignItems="center">
          <IconButton onClick={() => console.log("Toggle mode")}>
            {theme.palette.mode === "dark" ? (
              <DarkModeOutlined sx={{ fontSize: "25px" }} />
            ) : (
              <LightModeOutlined sx={{ fontSize: "25px" }} />
            )}
          </IconButton>
          <IconButton onClick={handleFriendRequestsClick}>
            <NotificationsOutlined sx={{ fontSize: "25px" }} />
          </IconButton>
          <IconButton>
            <SettingsOutlined sx={{ fontSize: "25px" }} />
          </IconButton>
        </Box>
      </Toolbar>

      {/* Backdrop to blur the background */}
      {showFriendRequests && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            backdropFilter: "blur(5px)",
            zIndex: 999,
          }}
          onClick={handleFriendRequestsClick} // Close the popup when backdrop is clicked
        />
      )}

      {/* Friend Requests Display */}
      {showFriendRequests && (
        <Box
          sx={{
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            zIndex: 1000,
            backgroundColor: theme.palette.background.paper,
            padding: "10px",
            borderRadius: "5px",
            maxWidth: "300px",
          }}
        >
          <Typography variant="h6" style={{ marginBottom: "10px" }}>Friend Requests</Typography>
          {friendRequests.map((request, index) => (
            <Box key={index} style={{ marginBottom: "5px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <Typography variant="body1" sx={{ mr: 2 }}>{request.name}</Typography>
              <Button
                variant="contained"
                color="primary"
                size="small"
                onClick={() => handleConfirmRequest(request._id)}
              >
                Confirm
              </Button>
            </Box>
          ))}
        </Box>
      )}

      {/* Notification */}
      {showNotification && (
        <Box
          sx={{
            position: "fixed",
            top: "20px",
            right: "20px",
            zIndex: 1000,
            backgroundColor: theme.palette.success.main,
            color: theme.palette.success.contrastText,
            padding: "10px",
            borderRadius: "5px",
          }}
        >
          New Friend Requests
        </Box>
      )}
    </AppBar>
  )
}

export default Navbar;
