import  Express from "express";
// import router from "./client";

const Router = Express.Router();
import Note from "../models/Transactions.js";

Router.post('/create',(req,res)=>{
    const title = req.body.title;
    const content = req.body.content;
    const newNote = new Note({
        title,
        content,
    })
    newNote.save();
    // res.send("done");
})
export default Note;