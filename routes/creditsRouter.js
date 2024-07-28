import express from "express";
import { getCreditsController } from "../controllers/creditsController.js";

const creditsRouter = express.Router();

creditsRouter.post("/getCredits", getCreditsController);


export default creditsRouter;