
import mongoose from "mongoose";

const TransactionSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      // required: true,
    },
    amount: {
      type: Number,
      // required: true,
    },
    category: {
      type: String,
      // enum: ['Food', 'Transportation', 'Utilities', 'Others'],
      // required: true,
    },
    date: {
      type: Date,
      // required: true,
    },
    time: {
      type: Date,
      // required: true,
    },
  }
);

const Transaction = mongoose.model("Transaction", TransactionSchema);
export default Transaction;