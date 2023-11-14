import  Express from "express";
// import router from "./client";
import Note from "../models/Transactions.js";

const Router = Express.Router();
// const Note = require("../models/Transactions");

// Router.route("/create").post((req,res)=>{
//     const title = req.body.title;
//     const content = req.body.content;
//     const newNote = new Note({
//         title,
//         content,
//     })
//     newNote.save();

// })
export default Note;