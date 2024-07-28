import express from "express";
// import serverless from "serverless-http";
import bodyParser from 'body-parser';
import cors from 'cors';
import multer from "multer";
import morgan from 'morgan';
import mongoose from 'mongoose';
// import usersRouter from "./routes/users.js";
// import creditsRouter from "./routes/creditsRouter.js";
// import imageRouter from "./routes/imageRouter.js";
// import documentRouter from "./routes/documentRouter.js";
// import spreadsheetRouter from "./routes/spreadsheetRouter.js";
// import textContent from "./routes/textContent.js";
import { getUserController, addUsersController, otpVerifyController, addContactUsController } from "./controllers/usersController.js";
import { getFaqsController, getBlogsController } from "./controllers/textContentController.js";
import { spreadsheet_xlsxConversion } from "./controllers/spreadsheetController/xlsxController.js";
import { spreadsheet_csvConversion } from "./controllers/spreadsheetController/csvController.js";
import { spreadsheet_xlsConversion } from "./controllers/spreadsheetController/xlsController.js";
import { spreadsheet_odsConversion } from "./controllers/spreadsheetController/odsController.js";
import { image_converter } from "./controllers/imageController.js";
import { document_pdfToTxt } from "./controllers/documentController/pdfController.js";
import { document_txtToPdf, document_txtToDocx, document_txtToHtml, document_txtToPptx } from "./controllers/documentController/txtController.js";
import { document_docxToHtml, document_docxToPdf, document_docxToTxt } from "./controllers/documentController/docxController.js";
import { getCreditsController } from "./controllers/creditsController.js";





//Connect with MongoDB
// maazdeveloper404
mongoose.connect("mongodb+srv://adminPalten:adminPalten@fileconverter.dg1qq02.mongodb.net/?retryWrites=true&w=majority&appName=fileConverter").then(() => {
    console.log("Connected to DB");
}).catch((err) => {
    // console.log(err.message);
});

const app = express();

//middlewares
app.use(cors());
app.use(express.json());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(morgan("dev"));

app.get("/",(req, res)=>{
    res.send("hello world");
})

// const upload = multer({ dest: 'tmp/uploads/' });

//USEER
app.post('/api/users/addusers', addUsersController);
app.post('/api/users/verifyOtp', otpVerifyController);
app.post('/api/users/getuser', getUserController);
app.post('/api/users/contactus', addContactUsController);

// CREDITS
app.post('/api/credits/getCredits', getCreditsController);

// IMAGE
// app.post('/api/file/image-converter', upload.single('file'), image_converter);

// // DOCUMENT
// app.post('/api/file/document-pdfToTxt', upload.single('file'), document_pdfToTxt);
// app.post('/api/file/document-txtToPdf', upload.single('file'), document_txtToPdf);
// app.post('/api/file/document-txtToDocx', upload.single('file'), document_txtToDocx);
// app.post('/api/file/document-txtToHtml', upload.single('file'), document_txtToHtml);
// app.post('/api/file/document-txtToPptx', upload.single('file'), document_txtToPptx);
// app.post('/api/file/document-docxToHtml',  upload.single('file'), document_docxToHtml);
// app.post('/api/file/document-docxToPdf', upload.single('file'), document_docxToPdf);
// app.post('/api/file/document-docxToTxt', upload.single('file'), document_docxToTxt);

// // SPRAEADSHEET
// app.post('/api/file/spreadsheet-xlsxConversion', upload.single('file'), spreadsheet_xlsxConversion);
// app.post('/api/file/spreadsheet-csvConversion', upload.single('file'), spreadsheet_csvConversion);
// app.post('/api/file/spreadsheet-xlsConversion', upload.single('file'), spreadsheet_xlsConversion);
// app.post('/api/file/spreadsheet-odsConversion', upload.single('file'), spreadsheet_odsConversion);

// TEXTCONTENT
app.post('/api/textContent/getFaqs', getFaqsController);
app.post('/api/textContent/getBlogs', getBlogsController);


// module.exports.handler = serverless(app);
const PORT = 3001
app.listen(PORT, ()=>{
    console.log("server is runing on port : "+ PORT);
})