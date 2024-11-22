import React, { useState, useEffect } from "react";
import axios from 'axios';
import {
  LightModeOutlined,
  NotificationsOutlined,
  DarkModeOutlined,
  Menu as MenuIcon,
  Search,
  SettingsOutlined,
  ArrowDropDownOutlined,
  Refresh,
} from "@mui/icons-material";
import {
  AppBar,
  Button,
  Box,
  Popover,
  Typography,
  IconButton,
  InputBase,
  Toolbar,
  List,
  ListItem,
  Menu,
  MenuItem,
  useTheme,
} from "@mui/material";
import { useDispatch } from "react-redux";
import { logout, setMode } from "state";
import profileImage from "assets/profileImage.png";
import FlexBetween from "component/FlexBetween";
import { useNavigate } from "react-router-dom";

const Navbar = ({ user, isSidebarOpen, setIsSidebarOpen }) => {
  const dispatch = useDispatch();
  const [friendRequests, setFriendRequests] = useState([]);
  const [groupRequests, setGroupRequests] = useState([]);
  const [anchorElNotification, setAnchorElNotification] = useState(null);
  const theme = useTheme();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const isOpen = Boolean(anchorEl);
  const handleClick = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);
  const uid = sessionStorage.getItem("id");
  const DOMAIN = process.env.REACT_APP_DOMAIN;
  const fetchFriendRequests = async () => {
    try {
      const response = await axios.get(`${DOMAIN}/api/v3/available-requests/${uid}`);
      setFriendRequests(response.data);
    } catch (error) {
      console.error('Error fetching friend requests:', error);
    }
  };

  const fetchGroupRequests = async () => {
    try {
      const response = await axios.get(`${DOMAIN}/api/v6/pendingGroupsReq/${uid}`);
      setGroupRequests(response.data);
    } catch (error) {
      console.error('Error fetching group requests:', error);
    }
  };

  useEffect(() => {
    fetchFriendRequests();
    fetchGroupRequests();
  }, [uid]);

  const handleNotificationClick = (event) => {
    setAnchorElNotification(event.currentTarget);
  };

  const handleNotificationClose = () => {
    setAnchorElNotification(null);
  };

  const handleConfirmRequest = async (requestId) => {
    try {
      const response = await axios.put(`${DOMAIN}/api/v3/confirm-friend/${requestId}/${uid}`);
      console.log(response.data.message);
      fetchFriendRequests();
    } catch (error) {
      console.error('Error confirming friend request:', error);
    }
  };

  const handleConfirmRequest1 = async (requestId) => {
    try {
      const response = await axios.post(`${DOMAIN}/api/v6/acceptGroupRequest`, {
        userId: uid,
        groupId: requestId,
      });
      console.log(response.data.message);
      fetchGroupRequests();
    } catch (error) {
      console.error('Error confirming group request:', error);
    }
  };

  const handleLogOut = async () => {
    dispatch(logout());
    sessionStorage.clear();
    navigate(`/login`);
  };

  const handleRefreshNotifications = () => {
    fetchFriendRequests();
    fetchGroupRequests();
  };

  return (
    <AppBar
      sx={{
        position: "static",
        background: "none",
        boxShadow: "none",
      }}
    >
      <Toolbar sx={{ justifyContent: "space-between" }}>
        {/* Left Side */}
        <FlexBetween>
          <IconButton onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
            <MenuIcon />
          </IconButton>
          <FlexBetween
            backgroundColor={theme.palette.background.alt}
            borderRadius="9px"
            gap="3rem"
            p="0.1rem 1.5rem"
          >
            <InputBase placeholder="Search..." />
            <IconButton>
              <Search />
            </IconButton>
          </FlexBetween>
        </FlexBetween>
        {/* Right Side */}
        <Box display="flex" alignItems="center">
          <IconButton onClick={() => dispatch(setMode())}>
            <DarkModeOutlined sx={{ fontSize: "25px" }} />
          </IconButton>
          <IconButton onClick={handleNotificationClick}>
            <NotificationsOutlined sx={{ fontSize: "25px" }} />
          </IconButton>

          <FlexBetween>
            <Button
              onClick={handleClick}
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                textTransform: "none",
                gap: "1rem",
              }}
            >
              <Box
                component="img"
                alt="profile"
                src={profileImage}
                height="32px"
                width="32px"
                borderRadius="50%"
                marginTop="18px"
                sx={{ objectFit: "cover" }}
              />
              <Box textAlign="left">
                <Typography
                  fontWeight="bold"
                  fontSize="0.85rem"
                  sx={{ color: theme.palette.secondary[100] }}
                >
                  {user.name}
                </Typography>
                <Typography
                  fontSize="0.75rem"
                  sx={{ color: theme.palette.secondary[200] }}
                >
                  {user.email}
                </Typography>
              </Box>
              <ArrowDropDownOutlined
                sx={{ color: theme.palette.secondary[300], fontSize: "25px" }}
              />
            </Button>
            <Menu
              anchorEl={anchorEl}
              open={isOpen}
              onClose={handleClose}
              anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
            >
              <MenuItem onClick={handleLogOut}>Log Out</MenuItem>
            </Menu>
          </FlexBetween>
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
              p: 2,
              backgroundColor: theme.palette.background.paper,
              borderRadius: '8px',
              boxShadow: theme.shadows[5],
            }}
            className="space-y-4"
          >
            <Box display="flex" justifyContent="space-between" alignItems="center">
              <Typography variant="h6" sx={{ color: theme.palette.text.primary }}>
                Notifications
              </Typography>
              <IconButton onClick={handleRefreshNotifications} size="small">
                <Refresh />
              </IconButton>
            </Box>
            <List className="space-y-2">
              {friendRequests.map((request, index) => (
                <ListItem key={index} className="bg-gray-100 rounded-lg p-2">
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                    <Typography variant="body2" sx={{ mr: 2 }}>{request.name}</Typography>
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
              {groupRequests.map((request, index) => (
                <ListItem key={index} className="bg-gray-100 rounded-lg p-2">
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                    <Typography variant="body2" sx={{ mr: 2 }}>{request.name}</Typography>
                    <Typography variant="body2" sx={{ mr: 2 }}>{request.amt}</Typography>
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