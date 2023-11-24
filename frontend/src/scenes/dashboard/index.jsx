import React, { useState, useEffect } from "react";
import FlexBetween from "component/FlexBetween";
import Header from "component/Header";
import { DownloadOutlined } from "@mui/icons-material";
import {
  Box,
  Button,
  Typography,
  useTheme,
  IconButton,
  useMediaQuery,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
} from "@mui/material";
import BreakdownChart from "../../scenes/overview";
import Expenses from "../../scenes/transactions";
import axios from "axios";
import EditIcon from "@mui/icons-material/Edit";

const Dashboard = () => {
  const theme = useTheme();
  const isNonMediumScreens = useMediaQuery("(min-width: 1200px)");
  const [balance, setBalance] = useState(null);
  const user = sessionStorage.getItem("id");
  // console.log(user);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5001/api/v4/balance/${user}`
        );
        setBalance(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    const fetchDataAndSetInterval = async () => {
      await fetchData();
      const interval = setInterval(fetchData, 5000); // Fetch every 5 seconds
      return () => clearInterval(interval);
    };

    const interval = fetchDataAndSetInterval();

    return () => {
      interval.then(clearInterval);
    };
  }, [user]);
  const [open, setOpen] = useState(false);

  const [newBudget, setNewBudget] = useState(0);
  const [currentBudget, setCurrentBudget] = useState(0); // Set initial budget value here

  // Function to handle opening and closing of the dialog
  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleEditClick = async () => {
    handleOpen();
    // Fetch the current budget value from the backend here and set it to setCurrentBudget
  };
  const handleEditBudget = async () => {
    handleOpen();
    // Fetch the current budget value from the backend here and set it to setCurrentBudget
  };

  const handleSave = async () => {
    try {
      // Call API endpoint to update the budget (replace 'your_api_endpoint' with your actual endpoint)
      const response = await axios.put(
        `http://localhost:5001/api/v4/Updatebalance/${user}`,
        { budget: newBudget }
      );

      // Update state with the new budget value from the response
      setCurrentBudget(response.data.budget);
      handleClose();
    } catch (error) {
      console.error("Error updating budget:", error);
      // Handle error here, show an error message, or perform any other necessary action
    }
  };

  return (
    <Box m="1.5rem 2.5rem">
      <FlexBetween>
        <Header title="DASHBOARD" subtitle="Welcome to your dashboard" />

        <Box>
          <Button
            sx={{
              backgroundColor: theme.palette.secondary.light,
              color: theme.palette.background.alt,
              fontSize: "14px",
              fontWeight: "bold",
              padding: "10px 20px",
            }}
          >
            <DownloadOutlined sx={{ mr: "10px" }} />
            Download Reports
          </Button>
        </Box>
      </FlexBetween>

      <Box
        mt="20px"
        display="grid"
        gridTemplateColumns="repeat(12, 1fr)"
        gridAutoRows="160px"
        gap="20px"
        sx={{
          "& > div": { gridColumn: isNonMediumScreens ? undefined : "span 12" },
        }}
      >
        {/* ROW 2 */}
        <Box
          gridColumn="span 4"
          gridRow="span 1"
          backgroundColor={theme.palette.background.alt}
          p="1.5rem"
          borderRadius="0.55rem"
          display="flex"
          flexDirection="column"
          justifyContent="space-between"
          alignItems="center"
        >
          <Box display="flex" alignItems="center">
            <Typography
              variant="body1"
              style={{
                fontSize: "1.5rem",
                fontWeight: "bold",
                color: theme.palette.secondary[100],
              }}
            >
              Balance
            </Typography>
            <Box ml={1} display="flex" alignItems="center">
              {/* Your currency icon */}
            </Box>
            {/* Edit Budget Button */}
            <IconButton
              onClick={handleEditBudget}
              sx={{
                backgroundColor: theme.palette.primary.main,
                color: theme.palette.primary.contrastText,
                "&:hover": {
                  backgroundColor: theme.palette.primary.dark,
                },
              }}
            >
              <EditIcon />
            </IconButton>
          </Box>
          <Typography
            variant="body1"
            style={{
              fontSize: "2.5rem",
              fontWeight: "bold",
              color: theme.palette.secondary[100],
            }}
          >
             ₹ {balance ? balance.budget : 0}
          </Typography>
        </Box>
        <Box
          gridColumn="span 4" // Update span to 4 for Balance, Amt Debit, Amt Credit
          gridRow="span 1"
          backgroundColor={theme.palette.background.alt}
          p="1.5rem"
          borderRadius="0.55rem"
          display="flex"
          flexDirection="column"
          justifyContent="space-between"
          alignItems="center" // Aligning label in center
        >
          <Box display="flex" alignItems="center">
            <Typography
              variant="body1"
              style={{
                fontSize: "1.5rem",
                fontWeight: "bold",
                color: theme.palette.secondary[100],
              }}
            >
              Amount Lent
            </Typography>{" "}
            {/* Making the label bold */}
            <Box ml={1} display="flex" alignItems="center">
              {/* Replace 'YourIcon' with your currency icon */}
            </Box>
           
           
            <>
              <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Edit Budget</DialogTitle>
                <DialogContent>
                  <TextField
                    label="New Budget"
                    type="number"
                    value={newBudget}
                    onChange={(e) => setNewBudget(e.target.value)}
                    fullWidth
                    margin="normal"
                  />
                  <Button
                    variant="contained"
                    onClick={handleSave}
                    sx={{
                      backgroundColor: theme.palette.primary.main,
                      color: theme.palette.primary.contrastText,
                      "&:hover": {
                        backgroundColor: theme.palette.primary.dark,
                      },
                    }}
                  >
                    Save
                  </Button>
                </DialogContent>
              </Dialog>
            </>
          </Box>
          <Typography
            variant="body1"
            style={{
              fontSize: "2.5rem",
              fontWeight: "bold",
              color: theme.palette.secondary[100],
            }}
          >
           ₹ {balance ? balance.amountLent : 0}
          </Typography>{" "}
          {/* Adjust font size and weight */}
        </Box>
        <Box
          gridColumn="span 4" // Update span to 4 for Balance, Amt Debit, Amt Credit
          gridRow="span 1"
          backgroundColor={theme.palette.background.alt}
          p="1.5rem"
          borderRadius="0.55rem"
          display="flex"
          flexDirection="column"
          justifyContent="space-between"
          alignItems="center" // Aligning label in center
        >
          <Box display="flex" alignItems="center">
            <Typography
              variant="body1"
              style={{
                fontSize: "1.5rem",
                fontWeight: "bold",
                color: theme.palette.secondary[100],
              }}
            >
              Amount Owed
            </Typography>{" "}
            {/* Making the label bold */}
            <Box ml={1} display="flex" alignItems="center">
              {/* Replace 'YourIcon' with your currency icon */}
            </Box>
            
          </Box>
          <Typography
            variant="body1"
            style={{
              fontSize: "2.5rem",
              fontWeight: "bold",
              color: theme.palette.secondary[100],
            }}
          >
            ₹ {balance ? balance.amountOwed : 0}
          </Typography>{" "}
          {/* Adjust font size and weight */}
        </Box>

        {/* ROW 3 */}
        <Box
          gridColumn="span 6" // Update span to 8 for Expenses
          gridRow="span 3"
          sx={{
            "& .MuiDataGrid-root": {
              border: "none",
              borderRadius: "5rem",
            },
            // Add other styles for Expenses component if needed
          }}
        >
          <Expenses dash={{ is: "0" }} />
        </Box>
        <Box
          gridColumn="span 6" // Update span to 4 for Sales By Category
          gridRow="span 3"
          backgroundColor={theme.palette.background.alt}
          p="1.5rem"
          borderRadius="0.55rem"
        >
          <BreakdownChart />
        </Box>
      </Box>
    </Box>
  );
};

export default Dashboard;
