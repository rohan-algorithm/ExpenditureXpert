import mongoose from 'mongoose';
///hello pratik
const Expanses = new mongoose.Schema({
    name:{
        type: String,
        required: true,
    },
    amount:{
        type: String,
        required: true,
    },
    category:{
        type: String,
        required: true,
    },
    date:{
        type: String,
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