import express from 'express';
import User from '../models/User.js';

const router = express.Router();

// Add friend request
router.post('/add-friend/:userId', async (req, res) => {
    try {
      const { userId } = req.params;
      const {email : friendMail} = req.body;
      const friendId = await User.findOne({ email: friendMail });
      const user = await User.findById(userId);
      const friend = await User.findById(friendId);

      if (!user || !friend) {
        return res.status(404).json({ message: 'User or friend not found' });
      }
      //exception
  
      user.pendingRequests.push(friendId);
      friend.availableRequests.push(userId);
  
      await user.save();
      await friend.save();
  
      res.status(200).json({ message: 'Friend request sent successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Error sending friend request', error: error.message });
    }
  });
  
// Confirm friend request - PUT method
router.put('/confirm-friend/:userId/:friendId', async (req, res) => {
    try {
      const { userId, friendId } = req.params;
  
      const user = await User.findById(userId);
      const friend = await User.findById(friendId);
  
      if (!user || !friend) {
        return res.status(404).json({ message: 'User or friend not found' });
      }
  
      if (!friend.availableRequests.includes(userId)) {
        return res.status(400).json({ message: 'Friend request not found or already accepted' });
      }
  
      user.pendingRequests = user.pendingRequests.filter(id => id.toString() !== friendId);
      friend.availableRequests = friend.availableRequests.filter(id => id.toString() !== userId);
  
      user.friends.push(friendId);
      friend.friends.push(userId);
  
      await user.save();
      await friend.save();
  
      res.status(200).json({ message: 'Friend request confirmed successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Error confirming friend request', error: error.message });
    }
  });
  

// Fetch user's friends
router.get('/get-friends/:userId', async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await User.findById(userId).populate('friends');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const friendsList = await Promise.all(user.friends.map(async (friend) => {
      // Fetch each friend's details separately based on their ID
      const friendDetails = await User.findById(friend._id,); // Assuming 'friendId' is the reference to the friend

      return {
        id: friend._id,
        name: friendDetails.name, // Include the friend's name
        email: friendDetails.email, 
        amountOwed: friend.amountOwed,
        amountLent: friend.amountLent,
      };
    }));

    res.status(200).json({ friends: friendsList });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


  router.get('/available-requests/:userId', async (req, res) => {
    try {
      const userId = req.params.userId;
  
      const user = await User.findById(userId)
        .populate('availableRequests', 'name email'); // Populate pending requests with user details
  
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
     
      const availableRequests = user.availableRequests;
      res.status(200).json(availableRequests);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching pending requests' });
    }
  });
  
export default router;
