import mongoose from "mongoose";

const TransactionSchema = new mongoose.Schema(
  {
    id: String,
    cost: String,
    Category: String,
  },
  { timestamps: true }
);

const Transaction = mongoose.model("Transaction", TransactionSchema);
export default Transaction;
