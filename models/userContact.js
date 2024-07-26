import mongoose from "mongoose";

//for create table into db
const usersContactSchema = new mongoose.Schema({

    // email: { type: String, required: true, unique: true },

    userName: { type: String, required: true },
    email: { type: String, required: true },
    city: { type: String, required: true },
    zip: { type: String, required: true },
    address: { type: String, required: true },
    message: { type: String, required: true },
    
}, {
    //for date
    timestamps: true
});

const UsersContact = mongoose.model("UserContacts", usersContactSchema);
export default UsersContact;