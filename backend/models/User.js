import mongoose from 'mongoose';

const userInfo = new mongoose.Schema({
    name:{
        type: String,
        required: true,
    },
    email:{
        type: String,
        required: true,
    },
    password:{
        type: String,
        required: true,
    },
    expanses:[{
        type:mongoose.Types.ObjectId,
        ref:'expanses',
    }],
    friends: [{
        type: mongoose.Types.ObjectId,
        ref: 'friends',
    }],
})

const userModel = mongoose.model('user', userInfo);

export default userModel;