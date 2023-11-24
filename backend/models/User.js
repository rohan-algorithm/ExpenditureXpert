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
        // required: true,
    },
    expanses:[{
        type:mongoose.Types.ObjectId,
        ref:'expanses',
    }],
    friends: [{
      friendId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'user', // Reference to other users (friends)
      },
      amountOwed: {
          type: Number,
          default: 0,
      },
      amountLent: {
          type: Number,
          default: 0,
      },
  }],
    pendingRequests: {
        type: [{
          type: mongoose.Schema.Types.ObjectId,
          ref: 'user',
        }],
        default: [],
    },
     availableRequests: {
        type: [{
          type: mongoose.Schema.Types.ObjectId,
          ref: 'user',
        }],
        default: [],
    },
    budget: {
      type: Number,
      default: 0,
    },
    amountOwed: {
      type: Number,
      default: 0,
    },
    amountLent: {
      type: Number,
      default: 0,
    },
    friends: [{
      friendId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'user', // Reference to other users (friends)
      },
      amountOwed: {
          type: Number,
          default: 0,
      },
      amountLent: {
          type: Number,
          default: 0,
      },
    }],
    groups:[{
      type:mongoose.Types.ObjectId,
      ref:'groups',
    }],
    pendingGroupRequests: [{
      groupId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'groups',
      },
      amt: {
        type: Number,
      },
    }],
    goals:[{
      type:mongoose.Types.ObjectId,
      ref:'goals',
    }],
    
})

const userModel = mongoose.model('user', userInfo);

export default userModel;