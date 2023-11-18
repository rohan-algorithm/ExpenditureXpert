import mongoose from 'mongoose';

const friendsInfo = new mongoose.Schema({
    userId: {
        type: mongoose.Types.ObjectId,
        ref: 'user',
        required: true,
    },
    friendId: {
        type: mongoose.Types.ObjectId,
        ref: 'user',
        required: true,
    },
    status: {
        type: String,
        enum: ['pending', 'accepted', 'rejected'],
        default: 'pending',
    },
    amountOwed: {
        type: Number,
        default: 0,
    },
    amountLent: {
        type: Number,
        default: 0,
    },
});

const friendsModel = mongoose.model('friends', friendsInfo);

export default friendsModel;
