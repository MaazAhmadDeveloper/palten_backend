import express from "express";
import { getFaqsController, getBlogsController } from "../controllers/textContentController.js";
const textContent = express.Router();

textContent.post("/getFaqs", getFaqsController);
textContent.post("/getBlogs", getBlogsController);


export default textContent;