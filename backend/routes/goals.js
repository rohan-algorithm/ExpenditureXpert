import express from 'express';
import User from '../models/User.js'; // Assuming this is your User model
import Goals from '../models/Goals.js'; 
const router = express.Router();


router.post('/createGoal', async (req, res) => {
  const { userId, name,description,amount,targetDate } = req.body;

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    const Goal = new Goals({ name,description,amount,targetDate,progress:0 });
    await Goal.save();


    user.goals.push(Goal);
    await user.save();

    res.status(201).json({ message: 'Goal created successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});




router.get("/getGoals/:id", async (req, res) => {
  try {
      const { id } = req.params;
      const existingUser = await User.findById(id).populate('goals');
    //   console.log(existingUser);
      if (existingUser) {
          return res.status(200).json({ goals: existingUser.goals });
      } else {
          return res.status(404).json({ message: "User not found" });
      }
  } catch (error) {
      return res.status(500).json({ message: "Internal Server Error" });
  }
});


router.get("/getGroupInfo/:id", async (req, res) => {
  try {
      const { id } = req.params;
      const Group = await Groups.findById(id);
      if (Group) {
          return res.status(200).json(Group);
      } else {
          return res.status(404).json({ message: "Group not found" });
      }
  } catch (error) {
      return res.status(500).json({ message: "Internal Server Error" });
  }
});

export default router;
