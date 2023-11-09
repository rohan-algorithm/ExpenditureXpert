import  Express from "express";
import{getUser} from "../Controllers/general.js"
const Router = Express.Router();

Router.get("/user/:id",getUser);

export default Router