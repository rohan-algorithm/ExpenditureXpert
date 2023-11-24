import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Container,
  TextField,
  Button,
  Paper,
  Grid,
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Box,
  LinearProgress,
} from '@mui/material';
import { DeleteOutline } from '@mui/icons-material';

// Linear progress bar component
function LinearProgressWithLabel(props) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <Box sx={{ width: '100%', mr: 1 }}>
        <LinearProgress variant="determinate" {...props} />
      </Box>
      <Box sx={{ minWidth: 35 }}>
        <Typography variant="body2" color="text.secondary">{`${Math.round(
          props.value,
        )}%`}</Typography>
      </Box>
    </Box>
  );
}

const GoalForm = () => {
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newGoal, setNewGoal] = useState({
    goalName: '',
    amount: 0,
    targetDate: '',
    description: '',
    progress: 0,
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`http://localhost:5001/api/v7/getGoals/65607a557be1cb81d7cbf98a`);
      setGoals(response.data.goals); // Assuming the response contains goals
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setLoading(false);
    }
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setNewGoal((prevGoal) => ({ ...prevGoal, [name]: value }));
  };

  const addGoal = async () => {
    try {
      // Implement your logic to add a new goal using axios post request
      // Example: await axios.post('YOUR_ADD_GOAL_ENDPOINT', newGoal);
      // After adding, fetch updated goals list
      await fetchData();
      setNewGoal({
        goalName: '',
        amount: 0,
        targetDate: '',
        description: '',
        progress: 0,
      });
    } catch (error) {
      console.error('Error adding goal:', error);
    }
  };

  return (
    <Container>
      <h2>Goal Tracker</h2>

      <Paper elevation={3}>
        <form>
          {/* Input fields for goal details */}
          <Button variant="contained" onClick={addGoal}>
            Add Goal
          </Button>
        </form>
      </Paper>

      <h3>Goal List</h3>
      {loading ? (
        <CircularProgress />
      ) : (
        <Grid container spacing={3}>
          {goals.map((goal) => (
            <Grid item key={goal.id} xs={8} sm={6} md={3} lg={3}>
              <Card>
                <CardContent>
                  <Typography variant="h6">{goal.goalName}</Typography>
                  <Typography variant="body2">{goal.description}</Typography>
                  <LinearProgressWithLabel value={goal.progress} />
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
};

export default GoalForm;
