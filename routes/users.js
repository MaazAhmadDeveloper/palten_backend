import express from "express";
import { getUserController, addUsersController, otpVerifyController, addContactUsController } from "../controllers/usersController.js";

const usersRouter = express.Router();

usersRouter.post("/addusers", addUsersController);
usersRouter.post("/verifyOtp", otpVerifyController);

usersRouter.post("/getuser", getUserController);

usersRouter.post("/contactus", addContactUsController);

export default usersRouter;