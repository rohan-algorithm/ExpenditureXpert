import express from 'express';
import User from '../models/User.js'; // Assuming this is your User model
import Groups from '../models/Groups.js'; // Assuming this is your User model

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
router.get('/balance/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const { budget, amountOwed, amountLent} = user; // Destructure user object to get required fields

    const userDetails = {
      budget,
      amountOwed,
      amountLent,
    };

    res.status(200).json(userDetails);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user details', error: error.message });
  }
});

router.put('/Updatebalance/:userId', async(req, res) => {
  const { userId } = req.params;
  const {budget} = req.body;
  console.log(userId);
  try {
    
    const user = await User.findById(userId);
    // console.log(user);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }else

     user.budget =budget ;
     console.log(user.budget);
     user.save();
    return res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user details', error: error.message });
  }
  
  
 
});


// router.put('Updatebalance/:userId', async(req, res) => {
//   const userId = req.params.userId;
//   const { budget } = req.body;

//   const user = await User.findById(userId);

//   if (!user) {
//     return res.status(404).json({ message: 'User not found' });
//   }
//   const { amountOwed} = user; // Destructure user object to get required fields
//   amountOwed = budget;
//     const userDetails = {
//       budget,
//       amountOwed,
//       amountLent,
//     };

//   User[userId].amountLent = budget; // Update the budget for the user

//   // Simulate some processing time (replace with database update or other logic)
//   setTimeout(() => {
//     res.json({ success: true, message: 'Budget updated successfully' });
//   }, 1000); // Delayed response for simulation purposes
// });




export default router;
