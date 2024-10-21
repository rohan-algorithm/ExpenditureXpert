import React, { useState, useEffect } from "react";
import FlexBetween from "component/FlexBetween";
import Header from "component/Header";
import { DownloadOutlined, Refresh } from "@mui/icons-material";
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
  const [thisMonthExpense, setThisMonthExpense] = useState(0);
  const [lastMonthExpense, setLastMonthExpense] = useState(0);
  const [savings, setSavings] = useState(0);
  const user = sessionStorage.getItem("id");
  const [open, setOpen] = useState(false);
  const [newBudget, setNewBudget] = useState(0);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleEditClick = async () => {
    handleOpen();
  };

  const handleEditBudget = async () => {
    handleOpen();
  };

  const handleSave = async () => {
    try {
      const response = await axios.put(
        `http://localhost:5001/api/v4/Updatebalance/${user}`,
        { budget: newBudget }
      );
      setSavings(newBudget); // Assuming savings is updated here
      handleClose();
    } catch (error) {
      console.error("Error updating budget:", error);
    }
  };

  const fetchData = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5001/api/v4/dashboard/${user}`
      );
      const { thisMonthExpense, lastMonthExpense, savings } = response.data;
      console.log(response.data);
      setThisMonthExpense(thisMonthExpense);
      setLastMonthExpense(lastMonthExpense);
      setSavings(savings);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <Box m="1.5rem 2.5rem">
      <FlexBetween>
        <Header title="DASHBOARD" subtitle="Welcome to your dashboard" />

        <Box display="flex" gap="1rem">
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
          <IconButton
            onClick={fetchData}
            sx={{
              backgroundColor: theme.palette.primary.main,
              color: theme.palette.primary.contrastText,
              "&:hover": {
                backgroundColor: theme.palette.primary.dark,
              },
            }}
          >
            <Refresh />
          </IconButton>
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
              This Month's Expense
            </Typography>
          </Box>
          <Typography
            variant="body1"
            style={{
              fontSize: "2.5rem",
              fontWeight: "bold",
              color: theme.palette.secondary[100],
            }}
          >
            ₹ {thisMonthExpense}
          </Typography>
        </Box>
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
              Last Month's Total Expense
            </Typography>
          </Box>
          <Typography
            variant="body1"
            style={{
              fontSize: "2.5rem",
              fontWeight: "bold",
              color: theme.palette.secondary[100],
            }}
          >
            ₹ {lastMonthExpense}
          </Typography>
        </Box>
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
              Savings
            </Typography>
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
            ₹ {savings}
          </Typography>
        </Box>

        {/* ROW 3 */}
        <Box
          gridColumn="span 6"
          gridRow="span 3"
          sx={{
            "& .MuiDataGrid-root": {
              border: "none",
              borderRadius: "5rem",
            },
          }}
        >
          <Expenses dash={{ is: "0" }} />
        </Box>
        <Box
          gridColumn="span 6"
          gridRow="span 3"
          backgroundColor={theme.palette.background.alt}
          p="1.5rem"
          borderRadius="0.55rem"
        >
          <BreakdownChart />
        </Box>
      </Box>

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
    </Box>
  );
};

export default Dashboard;