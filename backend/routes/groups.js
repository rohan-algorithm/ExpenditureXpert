import User from '../models/user';

// Route to create a new group
export const createGroup = async (req, res) => {
  const { userId, groupName, members } = req.body;

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const newGroup = {
      name: groupName,
      members: [userId, ...members],
      requests: [],
    };

    user.groups.push(newGroup);
    await user.save();

    res.status(201).json({ message: 'Group created successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Route to send a split request within a group
export const sendSplitRequest = async (req, res) => {
  const { userId, groupId, receiverId, splitAmount } = req.body;

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const group = user.groups.id(groupId);

    if (!group) {
      return res.status(404).json({ message: 'Group not found' });
    }

    group.requests.push({
      senderId: userId,
      receiverId,
      splitAmount,
      accepted: false,
    });

    await user.save();

    res.status(200).json({ message: 'Split request sent successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Other routes for managing groups (e.g., add members, accept requests) could be added similarly
