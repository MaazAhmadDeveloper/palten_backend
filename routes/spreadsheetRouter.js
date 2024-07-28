import express from "express";
import { spreadsheet_xlsxConversion } from "../controllers/spreadsheetController/xlsxController.js";
import { spreadsheet_csvConversion } from "../controllers/spreadsheetController/csvController.js";
import { spreadsheet_xlsConversion } from "../controllers/spreadsheetController/xlsController.js";
import { spreadsheet_odsConversion } from "../controllers/spreadsheetController/odsController.js";
import multer from "multer";
import path from "path";

// const storage = multer.memoryStorage();  
const upload = multer({ dest: 'uploads/' });


const spreadsheetRouter = express.Router();

spreadsheetRouter.post("/spreadsheet-xlsxConversion", upload.single('file'), spreadsheet_xlsxConversion);

spreadsheetRouter.post("/spreadsheet-csvConversion", upload.single('file'), spreadsheet_csvConversion);

spreadsheetRouter.post("/spreadsheet-xlsConversion", upload.single('file'), spreadsheet_xlsConversion);

spreadsheetRouter.post("/spreadsheet-odsConversion", upload.single('file'), spreadsheet_odsConversion);

export default spreadsheetRouter;