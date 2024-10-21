import mongoose from 'mongoose';
const Expanses = new mongoose.Schema({
    name:{
        type: String,
        required: true,
    },
    amount:{
        type: Number,
        required: true,
    },
    category:{
        type: String,
        required: true,
    },
    date:{
        type: Date,
        required: true,
    },
    time:{
        type: String,
        required: true,
    },
    user:[{
      type:mongoose.Types.ObjectId,
      ref:'user',
  }]
})

const expansesModel = mongoose.model('expanses', Expanses);

export default expansesModel;