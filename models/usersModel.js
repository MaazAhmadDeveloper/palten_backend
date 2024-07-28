import mongoose from "mongoose";

//for create table into db
const usersSchema = new mongoose.Schema({

    // email: { type: String, required: true, unique: true },

    userName: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    verificationOTP: { type: String },
    credits: {type: Number },
    isVerified: { type: Boolean, default: false },
    
}, {
    //for date
    timestamps: true
});

const Users = mongoose.model("Users", usersSchema);
export default Users;