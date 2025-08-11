import express from 'express';
import User from '../models/User.js';

const router = express.Router();

// Get current user profile
router.get('/profile', async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    res.json({ user });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching profile' });
  }
});

// Update user profile
router.patch('/profile', async (req, res) => {
  try {
    const { username, bio, avatar } = req.body;
    const updates = {};
    
    if (username) updates.username = username;
    if (bio !== undefined) updates.bio = bio;
    if (avatar !== undefined) updates.avatar = avatar;

    const user = await User.findByIdAndUpdate(
      req.user._id,
      updates,
      { new: true, runValidators: true }
    ).select('-password');

    res.json({ message: 'Profile updated', user });
  } catch (error) {
    res.status(500).json({ message: 'Error updating profile' });
  }
});

// Search users
router.get('/search', async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) {
      return res.status(400).json({ message: 'Search query required' });
    }

    const users = await User.find({
      $or: [
        { username: { $regex: q, $options: 'i' } },
        { email: { $regex: q, $options: 'i' } }
      ],
      _id: { $ne: req.user._id }
    })
    .select('username avatar bio isOnline lastSeen')
    .limit(10);

    res.json({ users });
  } catch (error) {
    res.status(500).json({ message: 'Error searching users' });
  }
});

// Get online users
router.get('/online', async (req, res) => {
  try {
    const users = await User.find({ isOnline: true })
      .select('username avatar bio lastSeen')
      .sort({ lastSeen: -1 })
      .limit(20);

    res.json({ users });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching online users' });
  }
});

export default router;

