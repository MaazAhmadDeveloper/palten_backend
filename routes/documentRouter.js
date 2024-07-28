import express from "express";
import { document_pdfToTxt } from "../controllers/documentController/pdfController.js";
import { document_txtToPdf, document_txtToDocx, document_txtToHtml, document_txtToPptx } from "../controllers/documentController/txtController.js";
import { document_docxToHtml, document_docxToPdf, document_docxToTxt } from "../controllers/documentController/docxController.js";
import multer from "multer";
import path from "path";

// const storage = multer.memoryStorage(); 
const upload = multer({ dest: 'uploads/' });


const documentRouter = express.Router();

documentRouter.post("/document-pdfToTxt", upload.single('file'), document_pdfToTxt);

documentRouter.post("/document-txtToPdf", upload.single('file'), document_txtToPdf);
documentRouter.post("/document-txtToDocx", upload.single('file'), document_txtToDocx);
documentRouter.post("/document-txtToHtml", upload.single('file'), document_txtToHtml);
documentRouter.post("/document-txtToPptx", upload.single('file'), document_txtToPptx);

documentRouter.post("/document-docxToHtml", upload.single('file'), document_docxToHtml);
documentRouter.post("/document-docxToPdf", upload.single('file'), document_docxToPdf);
documentRouter.post("/document-docxToTxt", upload.single('file'), document_docxToTxt);

export default documentRouter;