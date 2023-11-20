import express from 'express';
import User from '../models/User.js';
import Expenses from '../models/Expanses.js';

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
  
  
  export default router;
