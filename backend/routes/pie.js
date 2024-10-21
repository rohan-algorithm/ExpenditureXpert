import express from 'express';
import User from '../models/User.js';
import Expenses from '../models/Expanses.js';
import mongoose from 'mongoose';

const router = express.Router();
router.get('/pie/:viewType/:userId', async (req, res) => {
  const { viewType, userId } = req.params;

  try {
    const userExpenses = await Expenses.find({ user: userId });

    const expensesByCategory = userExpenses.reduce((acc, expense) => {
      const { category, amount, date } = expense;
      const expenseDate = new Date(date);
      let key;

      if (viewType === 'monthly') {
        key = `${expenseDate.getFullYear()}-${expenseDate.getMonth() + 1}`;
      } else if (viewType === 'yearly') {
        key = `${expenseDate.getFullYear()}`;
      } else {
        key = 'all';
      }

      if (!acc[key]) {
        acc[key] = {};
      }

      if (!acc[key][category]) {
        acc[key][category] = 0;
      }

      acc[key][category] += parseInt(amount, 10);
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

  
  router.get('/monthlyComparison/:userId', async (req, res) => {
    try {
      const userId = req.params.userId;
      const userExpenses = await Expenses.find({ user: userId });
     
      // Aggregate expenses grouped by month and year
      const monthlyExpenses = await Expenses.aggregate([
        {
          $match: {
            user: mongoose.Types.ObjectId(userObjectId),
          },
        },
        {
          $group: {
            _id: {
              year: { $year: '$date' },
              month: { $month: '$date' },
            },
            total: { $sum: '$amount' },
          },
        },
        {
          $sort: {
            '_id.year': 1,
            '_id.month': 1,
          },
        },
      ]);
      console.log("yjnjbjjbjbe" ,monthlyExpenses);
      // Format the data for the response
      const data = monthlyExpenses.map(expense => ({
        name: `${expense._id.month}/${expense._id.year}`,
        total: expense.total,
      }));
  
      res.json(data);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });
  

  

  

  router.get('/yearly/:userIdx', async (req, res) => {
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


  
  
  
  
  export default router;
