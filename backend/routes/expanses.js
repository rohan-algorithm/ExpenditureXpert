import Express from "express";
import User from "../models/User.js";
import Expanses from "../models/Expanses.js";
const Router = Express.Router();


//Create New Expanse
Router.post("/addExpanse", async (req, res) => {
    try {
        const { name, amount, category,date,time ,id } = req.body;

        // Find user by email
        const existingUser = await User.findById(id);

        if (existingUser) {
            const expanse = new Expanses({ name, amount, category,date,time, user: existingUser });
            await expanse.save();
            ///hello pratik
            // Push expanse to user's expanses and save the user
            existingUser.expanses.push(expanse);
            existingUser.budget -= amount;
            console.log(existingUser);
            await existingUser.save();

            return res.status(200).json({ expanse });
        } else {
            return res.status(404).json({ message: "User not found" });
        }
    } catch (error) {
        return res.status(500).json({ message: "Internal Server Error" });
    }
});



//Fetch Expanses
Router.get("/getExpenses/:id", async (req, res) => {
    try {
        const { id } = req.params;

        // Find user by email
        const existingUser = await User.findById(id).populate('expanses');

        if (existingUser) {
            return res.status(200).json({ expenses: existingUser.expanses });
        } else {
            return res.status(404).json({ message: "User not found" });
        }
    } catch (error) {
        return res.status(500).json({ message: "Internal Server Error" });
    }
});

// Update Expanse
Router.put("/updateExpense/:Id", async (req, res) => {
    try {
        const { Id } = req.params;
        const { name, amount, category } = req.body;

        // Find the expense by ID and update it
        const updatedExpanse = await Expanses.findByIdAndUpdate(
            Id,
            { name, amount, category },
        );

        if (updatedExpanse) {
            return res.status(200).json({ expanse: updatedExpanse });
        } else {
            return res.status(404).json({ message: "Expense not found" });
        }
    } catch (error) {
        return res.status(500).json({ message: "Internal Server Error" });
    }
});


//Delete Expanse
Router.delete("/deleteExpense/:expanseId", async (req, res) => {
    try {
        const { expanseId } = req.params;
        // Find the expense by ID and delete it
        const deletedExpanse = await Expanses.findByIdAndDelete(expanseId);

        if (deletedExpanse) {
            // Remove the deleted expense from the associated user's expanses
            const associatedUser = await User.findById(deletedExpanse.user);
            if (associatedUser) {
                associatedUser.expanses.pull(expanseId);
                existingUser.budget +=  parseInt(deletedExpanse.amount);
                await associatedUser.save();
            }
            return res.status(200).json({ message: "Expense deleted successfully" });
        } else {
            return res.status(404).json({ message: "Expense not found" });
        }
    } catch (error) {
        return res.status(500).json({ message: "Internal Server Error" });
    }
});



export default Router;