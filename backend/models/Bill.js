// bill.js or billModel.js
import mongoose from 'mongoose';

const billSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    amount: {
        type: Number,
        required: true,
    },
    // Add more fields as needed
});

const Bill = mongoose.model('bill', billSchema);

export default Bill;
