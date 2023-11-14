import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import helmet from "helmet";
import morgan from "morgan";
import Note from "./models/Transactions.js";
import FormDataModel from "./models/User.js";

// const Expense = require('./models/Transactions.js'); // Import the Mongoose Expense model

const Router = express.Router();

import TransactionSchema from "./models/Transactions.js";
import Transaction from "./routes/noteRoute.js";

 


/* CONFIGURATION */
dotenv.config();
const app = express();
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("common"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());
import clientRoutes from "./routes/client.js";
import generalRoutes from "./routes/general.js";
import transectionsRoutes from "./routes/transactions.js";
import salesRoutes from "./routes/sales.js";



// /* ROUTES */
// app.use("/client", clientRoutes);
// app.use("/general", generalRoutes);
// app.use("/transactions", transectionsRoutes);
// app.use("/sales", salesRoutes);


app.get('/create',async(req,res)=>{
  //  res.send("hi");
   const data = await TransactionSchema.find({});
   res.json({success:true,data:data});
})
// app.use("/",Transaction);
app.post('/create',(req,res)=>{
  const name = req.body.name;
  const amount = req.body.amount;
  const category = req.body.category;
  const date = req.body.date;
  const time = req.body.time;
   const newExpense = new Note({
    name,
    amount,
    category,
    date,
    time,
  });
  newExpense.save();
  // res.send("done");
})

// app.use("/api/users", userRoutes);
// app.use("/api/auth", authRoutes);

app.post('/register', (req, res)=>{
  // To post / insert data into database

  const {email, password} = req.body;
  FormDataModel.findOne({email: email})
  .then(user => {
      if(user){
          res.json("Already registered")
      }
      else{
          FormDataModel.create(req.body)
          .then(log_reg_form => res.json(log_reg_form))
          .catch(err => res.json(err))
      }
  })
  
})

app.post('/login', (req, res)=>{
  // To find record from the database
  const {email, password} = req.body;
  FormDataModel.findOne({email: email})
  .then(user => {
      if(user){
          // If user found then these 2 cases
          if(user.password === password) {
              res.json("Success");
          }
          else{
              res.json("Wrong password");
          }
      }
      // If user not found then 
      else{
          res.json("No records found! ");
      }
  })
})

// app.post('/create', (req, res) => {
//   const { name, amount, category, date, time } = req.body;

//   // Assuming you have a Mongoose or other ORM model for expenses
//   // const Expense = require('./models/Transactions.js'); // Import the Mongoose Expense model

//   const newExpense = new Expense({
//     name,
//     amount,
//     category,
//     date,
//     time,
//   });

//   newExpense.save((err, savedExpense) => {
//     if (err) {
//       res.status(500).send('Error saving expense');
//     } else {
//       res.status(200).json(savedExpense);
//     }
//   });
// });


/* MONGOOSE SETUP */
const PORT = process.env.PORT || 9000;
mongoose.connect(process.env.MONGO_URL, {
    // useNewUrlParser: true,
    // useUnifiedTopology: true,
  }).then(() => {
    app.listen(PORT, () => console.log(`Server Port: ${PORT}`));

    /* ONLY ADD DATA ONE TIME */
    // AffiliateStat.insertMany(dataAffiliateStat);
    // OverallStat.insertMany(dataOverallStat);
    // Product.insertMany(dataProduct);
    // ProductStat.insertMany(dataProductStat);
    // Transaction.insertMany(dataTransaction);
    // User.insertMany(dataUser);
      
  })
  .catch((error) => console.log(`${error} did not connect`));



  