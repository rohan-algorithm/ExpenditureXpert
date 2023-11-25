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
      amountOwed: {
        type: Number,
        default: 0,
      },
    }],
  });
  
const groupSchemaModel = mongoose.model('groups', groupSchema);

export default groupSchemaModel;