import mongoose from 'mongoose';


const groupSchema = new mongoose.Schema({
    name: {
      type: String,
      required: true,
    },
    members: [{
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
      },
      memberName: String,
      amount: {
        type: Number,
        default: 0,
      },
    }],
    history: [{
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
      },
      memberName: String,
      date: { type: Date, default: Date.now },
      amountPaid: {
        type: Number,
        default: 0,
      },
    }],
    balance: {
      type: Number,
      default: 0,
    },
  });
  
const groupSchemaModel = mongoose.model('groups', groupSchema);

export default groupSchemaModel;