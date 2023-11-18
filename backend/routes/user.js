import express from 'express';
import User from '../models/User.js'; // Assuming this is your User model

const router = express.Router();

// Route to get user details by ID
router.get('/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const { name, email } = user; // Destructure user object to get required fields

    const userDetails = {
      name,
      email,
      // Add other necessary user details if needed
    };

    res.status(200).json(userDetails);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user details', error: error.message });
  }
});

export default router;
