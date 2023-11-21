import express from 'express';
import User from '../models/User.js';
import Expenses from '../models/Expanses.js';
import mongoose from 'mongoose';

const router = express.Router();
// Fetch user expenses grouped by category
router.get('/pie/:userId', async (req, res) => {
    const { userId } = req.params;
  
    try {
      const userExpenses = await Expenses.find({ user: userId });
      const expensesByCategory = userExpenses.reduce((acc, expense) => {
        const { category, amount } = expense;
        if (!acc[category]) {
          acc[category] = 0;
        }
        acc[category] += parseInt(amount, 10);
        return acc;
      }, {});
  
      res.status(200).json({ expensesByCategory });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

  router.get('/monthly/:userId', async (req, res) => {
    try {
      const userObjectId = req.params.userId;

      if (!userObjectId) {
        return res.status(400).json({ message: 'Invalid user ID' });
      }
  
      // Fetch all expenses for the user
      const allExpenses = await Expenses.find({ user: userObjectId });
  
      // Group expenses by month and category
      const monthlyExpenses = allExpenses.reduce((result, expense) => {
        const date = new Date(expense.date);
        const month = date.getMonth() + 1; // Get month (1-12)
        const year = date.getFullYear();
        const key = `${year}-${month}`;
  
        if (!result[key]) {
          result[key] = {};
        }
  
        if (!result[key][expense.category]) {
          result[key][expense.category] = 0;
        }
  
        result[key][expense.category] += parseFloat(expense.amount);
        return result;
      }, {});
  
      res.json(monthlyExpenses);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });
  
  router.get('/weekly/:userId', async (req, res) => {
    try {
      const userObjectId = req.params.userId;
  
      if (!userObjectId) {
        return res.status(400).json({ message: 'Invalid user ID' });
      }
  
      // Fetch all expenses for the user
      const allExpenses = await Expenses.find({ user: userObjectId });
  
      // Group expenses by week and category
      const weeklyExpenses = allExpenses.reduce((result, expense) => {
        const date = new Date(expense.date);
        const year = date.getFullYear();
        const weekNumber = getWeekNumber(date);
  
        const key = `${year}-W${weekNumber}`;
  
        if (!result[key]) {
          result[key] = {};
        }
  
        if (!result[key][expense.category]) {
          result[key][expense.category] = 0;
        }
  
        result[key][expense.category] += parseFloat(expense.amount);
        return result;
      }, {});
  
      res.json(weeklyExpenses);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });
  
  function getWeekNumber(date) {
    const oneJan = new Date(date.getFullYear(), 0, 1);
    const dayOfYear = Math.ceil((date - oneJan) / 86400000);
    return Math.ceil(dayOfYear / 7);
  }
  

  router.get('/yearly/:userId', async (req, res) => {
    try {
      const userObjectId = req.params.userId;
  
      if (!userObjectId) {
        return res.status(400).json({ message: 'Invalid user ID' });
      }
  
      // Fetch all expenses for the user
      const allExpenses = await Expenses.find({ user: userObjectId });
  
      // Group expenses by year and category
      const yearlyExpenses = allExpenses.reduce((result, expense) => {
        const date = new Date(expense.date);
        const year = date.getFullYear();
  
        if (!result[year]) {
          result[year] = {};
        }
  
        if (!result[year][expense.category]) {
          result[year][expense.category] = 0;
        }
  
        result[year][expense.category] += parseFloat(expense.amount);
        return result;
      }, {});
  
      res.json(yearlyExpenses);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });

  router.get('/monthlyComparison/:userId', async (req, res) => {
    try {
      const userObjectId = req.params.userId;
  
      if (!userObjectId) {
        return res.status(400).json({ message: 'Invalid user ID' });
      }
  
      // Get the current date
      const currentDate = new Date();
      const currentYear = currentDate.getFullYear();
      const currentMonth = currentDate.getMonth() + 1;
  
      // Construct ISO strings for the start and end of the current month
      const startOfCurrentMonth = new Date(Date.UTC(currentYear, currentMonth - 1, 1)).toISOString();
      const endOfCurrentMonth = new Date(Date.UTC(currentYear, currentMonth, 0, 23, 59, 59)).toISOString();
  
      // Get the previous month's dates
      const previousYear = currentMonth === 1 ? currentYear - 1 : currentYear;
      const previousMonth = currentMonth === 1 ? 12 : currentMonth - 1;
      const startOfPreviousMonth = new Date(Date.UTC(previousYear, previousMonth - 1, 1)).toISOString();
      const endOfPreviousMonth = new Date(Date.UTC(previousYear, previousMonth, 0, 23, 59, 59)).toISOString();
  
      // Aggregate expenses for the current month
      const currentMonthExpenses = await Expenses.aggregate([
        {
          $match: {
            user: userObjectId,
            date: { $gte: startOfCurrentMonth, $lte: endOfCurrentMonth },
          },
        },
        {
          $group: {
            _id: null,
            total: { $sum: '$amount' },
          },
        },
      ]);
  
      // Aggregate expenses for the previous month
      const prevMonthExpenses = await Expenses.aggregate([
        {
          $match: {
            user: userObjectId,
            date: { $gte: startOfPreviousMonth, $lte: endOfPreviousMonth },
          },
        },
        {
          $group: {
            _id: null,
            total: { $sum: '$amount' },
          },
        },
      ]);
  
      const data = [
        {
          name: 'Current Month',
          currentMonth: currentMonthExpenses.length > 0 ? currentMonthExpenses[0].total : 0,
          prevMonth: prevMonthExpenses.length > 0 ? prevMonthExpenses[0].total : 0,
        },
      ];
  
      res.json(data);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });
  
  
  
  
  
  export default router;
