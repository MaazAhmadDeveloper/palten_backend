import express from "express";
import { image_converter } from "../controllers/imageController.js";
import multer from "multer";

// const storage = multer.memoryStorage(); 
const upload = multer({ dest: 'uploads/' });


const imageRouter = express.Router();

imageRouter.post("/image-converter", upload.single('file'), image_converter);


export default imageRouter;