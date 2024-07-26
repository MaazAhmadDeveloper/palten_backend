import express from "express";
// import serverless from "serverless-http";
import bodyParser from 'body-parser';
import cors from 'cors';
import morgan from 'morgan';
import mongoose from 'mongoose';
import usersRouter from "./routes/users.js";
import creditsRouter from "./routes/creditsRouter.js";
import imageRouter from "./routes/imageRouter.js";
import documentRouter from "./routes/documentRouter.js";
import spreadsheetRouter from "./routes/spreadsheetRouter.js";
import textContent from "./routes/textContent.js";


//Connect with MongoDB
// maazdeveloper404
mongoose.connect("mongodb+srv://maazDeveloper:maazDeveloper@fileconverter.dg1qq02.mongodb.net/?retryWrites=true&w=majority&appName=fileConverter").then(() => {
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

app.use('/api/users/', usersRouter);
app.use('/api/credits/', creditsRouter);
app.use('/api/file/', imageRouter);
app.use('/api/file/', documentRouter);
app.use('/api/file/', spreadsheetRouter);
app.use('/api/textContent/', textContent);


// module.exports.handler = serverless(app);
const PORT = 3001
app.listen(PORT, ()=>{
    console.log("server is runing on port : "+ PORT);
})