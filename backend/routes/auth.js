import { Router } from "express";
import User from '../models/User.js';
import bcrypt from 'bcrypt';
const router = Router();


//Sign up 

router.post("/signup", async (req, res) => {
	try {
	  const { name, email, password } = req.body;
  
	  // Validate input data
	  if (!name || !email || !password) {
		return res.status(400).json({ message: "All fields are required" });
	  }
  
	  // Check if the user already exists
	  const existingUser = await User.findOne({ email });
	  if (existingUser) {
		console.log(existingUser);
		return res.status(409).json({ message: "Email already registered" });
	  }
  
	  // Hash the password before saving it
	  const hashedPassword = await bcrypt.hash(password, 10); // 10 is the saltRounds
  
	  const newUser = new User({ name, email, password: hashedPassword });
	  await newUser.save();
  
	  console.log(newUser);
	  return res.status(201).json({ message: "User created successfully", newUser  });
	} catch (err) {
	  console.error(err);
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
  
	  const { password, ...newUser } = user._doc;
	  console.log(newUser);
	  return res.status(200).json({ user: newUser });
  
	} catch (err) {
	  console.error(err);
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
