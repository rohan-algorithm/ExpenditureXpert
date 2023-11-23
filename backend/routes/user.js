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

router.put('Updatebalance/:userId', async(req, res) => {
  const userId = req.params.userId;
  const { budget } = req.body;

  const user = await User.findById(userId);

  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }
  const { amountOwed} = user; // Destructure user object to get required fields
  amountOwed = budget;
    const userDetails = {
      budget,
      amountOwed,
      amountLent,
    };

  User[userId].amountLent = budget; // Update the budget for the user

  // Simulate some processing time (replace with database update or other logic)
  setTimeout(() => {
    res.json({ success: true, message: 'Budget updated successfully' });
  }, 1000); // Delayed response for simulation purposes
});


router.post('/createGroup', async (req, res) => {
  const { userId, name } = req.body;

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    const Group = new Groups({ name, members: [{ userId: user._id ,amt:0}]});
    await Group.save();


    user.groups.push(Group);
    await user.save();

    res.status(201).json({ message: 'Group created successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


router.post('/sendGroupInvitation', async (req, res) => {
  const { userId, invitedUserId, groupId, amt } = req.body;

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const invitedUser = await User.findById(invitedUserId);

    if (!invitedUser) {
      return res.status(404).json({ message: 'Invited user not found' });
    }

    const group = Groups.findById(groupId);
    
    if (!group) {
      return res.status(404).json({ message: 'Group not found' });
    }

    const re = { groupId: groupId,amt:amt};
    invitedUser.pendingGroupRequests.push(re);
    await user.save();
    await invitedUser.save();

    res.status(200).json({ message: 'Group invitation sent successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});



router.post('/acceptGroupRequest', async (req, res) => {
  const { userId, groupId } = req.body;

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const group = await Groups.findById(groupId);

    if (!group) {
      return res.status(404).json({ message: 'Group not found' });
    }

    const foundObject = user.pendingGroupRequests.find(item => item.groupId && item.groupId.toString() === groupId);
    if(!foundObject) return res.status(404).json({ message: 'Req not found' });

    const acceptedRequest = user.pendingGroupRequests.splice(foundObject, 1)[0];
    // Add the user to the group as a member
    const info = { userId: user._id ,amt:foundObject.amt};

    group.members.push(info);

    await user.save();
    await group.save();

    res.status(200).json({ message: 'Group request accepted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


export default router;
