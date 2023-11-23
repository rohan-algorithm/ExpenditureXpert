// Assuming you have an existing route for bills, let's say in 'billRoutes.js'

import Express from 'express';
import Bill from '../models/Bill'; // Adjust the path accordingly

const Router = Express.Router();

// Route to add a new bill
Router.post('/add-bill', async (req, res) => {
    try {
        const { title, amount } = req.body;

        // Create a new bill using the Bill model
        const newBill = new Bill({
            title,
            amount,
            // Add more fields as needed
        });

        // Save the new bill
        await newBill.save();

        res.status(200).json({ bill: newBill });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

// Route to get all bills
Router.get('/get-bills', async (req, res) => {
    try {
        // Fetch all bills from the database
        const bills = await Bill.find();

        res.status(200).json({ bills });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

// Add more routes as needed for updating, deleting, or fetching individual bills

export default Router;
