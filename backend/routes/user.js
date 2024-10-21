import express from 'express';
import mongoose from 'mongoose';
import User from '../models/User.js';
import Expense from '../models/Expanses.js';

const router = express.Router();

// Helper function to get the first and last day of a month
const getMonthRange = (year, month) => {
  const startDate = new Date(year, month, 1);
  const endDate = new Date(year, month + 1, 0);
  return { startDate, endDate };
};

// Route to get dashboard data 
router.get('/dashboard/:user', async (req, res) => {
  const userId = req.params.user;
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();
  const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
  const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;

  try {
    // Get this month's expenses
    const { startDate: thisMonthStart, endDate: thisMonthEnd } = getMonthRange(currentYear, currentMonth);
    console.log(`This Month Start: ${thisMonthStart}, End: ${thisMonthEnd}`);
    const thisMonthExpenses = await Expense.aggregate([
      { $match: { 'user': new mongoose.Types.ObjectId(userId), date: { $gte: thisMonthStart, $lte: thisMonthEnd } } },
      { $group: { _id: null, total: { $sum: '$amount' } } },
    ]);
    // console.log(`This Month Expenses: ${JSON.stringify(thisMonthExpenses)}`);

    // Get last month's expenses
    const { startDate: lastMonthStart, endDate: lastMonthEnd } = getMonthRange(lastMonthYear, lastMonth);
    // console.log(`Last Month Start: ${lastMonthStart}, End: ${lastMonthEnd}`);
    const lastMonthExpenses = await Expense.aggregate([
      { $match: { 'user': new mongoose.Types.ObjectId(userId), date: { $gte: lastMonthStart, $lte: lastMonthEnd } } },
      { $group: { _id: null, total: { $sum: '$amount' } } },
    ]);
    // console.log(`Last Month Expenses: ${JSON.stringify(lastMonthExpenses)}`);

    // Get savings (assuming savings is stored in the budget field)
    const user = await User.findById(userId);

    res.json({
      thisMonthExpense: thisMonthExpenses[0] ? thisMonthExpenses[0].total : 0,
      lastMonthExpense: lastMonthExpenses[0] ? lastMonthExpenses[0].total : 0,
      savings: user ? user.budget : 0,
    });
  } catch (error) {
    // console.error('Error fetching dashboard data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


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

    const { budget, amountOwed, amountLent } = user; // Destructure user object to get required fields

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

router.put('/Updatebalance/:userId', async (req, res) => {
  const { userId } = req.params;
  const { budget } = req.body;

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.budget = budget;
    await user.save();

    return res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error updating user budget', error: error.message });
  }
});

export default router;