import mongoose from 'mongoose';

const GoalSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    amount: {
        type: Number,
        required: true,
    },
    targetDate: {
        type: String,
        required: true,
    },
    progress:{
        type: Number,
        required: true,
        default:0,
    },
});

const Goal = mongoose.model('goals', GoalSchema);

export default Goal;
