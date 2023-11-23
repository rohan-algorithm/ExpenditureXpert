import express from 'express';
import User from '../models/User.js'; // Assuming this is your User model
import Groups from '../models/Groups.js'; 

const router = express.Router();
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


router.get("/getExpenses/:id", async (req, res) => {
  try {
      const { id } = req.params;

      // Find user by email
      const existingUser = await User.findById(id).populate('groups');
      console.log(existingUser);
      console.log(existingUser);
      if (existingUser) {
          return res.status(200).json({ groups: existingUser.groups });
      } else {
          return res.status(404).json({ message: "User not found" });
      }
  } catch (error) {
      return res.status(500).json({ message: "Internal Server Error" });
  }
});
export default router;
