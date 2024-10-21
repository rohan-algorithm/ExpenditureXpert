import express from 'express';
import User from '../models/User.js'; // Assuming this is your User model
import Goals from '../models/Goals.js'; 
const router = express.Router();

router.post('/createGoal', async (req, res) => {
  const { uid, goalName, description, amount, progress,targetDate } = req.body;
  // console.log(req.body);
  try {
    const user = await User.findById(uid);
    // console.log("This" + user);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const goal = new Goals({ name:goalName, description, amount, targetDate, progress });
    await goal.save();

    user.goals.push(goal);
    await user.save();

    res.status(201).json({ message: 'Goal created successfully', goal });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/getGoals/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const existingUser = await User.findById(id).populate('goals');

    if (existingUser) {
      return res.status(200).json({ goals: existingUser.goals });
    } else {
      return res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    return res.status(500).json({ message: 'Internal Server Error' });
  }
});

router.get('/getGroupInfo/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const group = await Groups.findById(id);

    if (group) {
      return res.status(200).json(group);
    } else {
      return res.status(404).json({ message: 'Group not found' });
    }
  } catch (error) {
    return res.status(500).json({ message: 'Internal Server Error' });
  }
});

export default router;