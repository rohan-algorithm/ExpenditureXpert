import { Router } from "express";
const router = Router();
import User from '../models/User.js';
import bcrypt from 'bcrypt';


//Sign up 

router.post("/signup", async (req, res) => {
	try {
	  const { name,email, password } = req.body;
  
	  // Hash the password before saving it
	  const hashedPassword = await bcrypt.hash(password, 10); // 10 is the saltRounds
  
	  const newUser = new User({ name,email, password: hashedPassword });
	  await newUser.save();
  
	  return res.status(201).json({ message: "User created successfully" });
	} catch (err) {
	  return res.status(500).json({ message: "Error creating user" });
	}
  });


//Sign in

router.post("/signin", async (req, res) => {
	try {
	  const user = await User.findOne({ email: req.body.email });
	  if (!user) {
		return res.status(400).json({ message: "Please Sign Up First" });
	  }
  
	  const passwordMatch = await bcrypt.compare(req.body.password, user.password);
  
	  if (!passwordMatch) {
		return res.status(400).json({ message: "Incorrect Password" });
	  }
  
	  const { password, ...others } = user._doc;
	  return res.status(200).json({ others });
	} catch (err) {
	  return res.status(500).json({ message: "Internal Server Error" });
	}
  });


  // Logout route
  router.get("/logout", async (req, res) => {
	try {
	  req.session.destroy((err) => {
		if (err) {
		  return res.status(500).json({ message: "Logout failed" });
		}
		res.status(200).json({ message: "Logout successful" });
	  });
	} catch (err) {
	  return res.status(500).json({ message: "Internal Server Error" });
	}
  });
  
export default router;
