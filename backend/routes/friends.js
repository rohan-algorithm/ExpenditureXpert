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
      console.log(user);
      console.log(friend);

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
      const user = await User.findById(userId).populate('friends', 'name email'); // Populate friend details
  
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
    
      const friendsList = user.friends.map(friend => ({
        id: friend._id,
        username: friend.name,
        email: friend.email,
      }));
  
      res.status(200).json({ friends: friendsList });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });
  
export default router;
