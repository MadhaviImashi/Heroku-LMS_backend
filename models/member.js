//import mongoose
const mongoose = require("mongoose");
//assign the Schema object of mongoose into a new const
const Schema = mongoose.Schema;

//create a book schema using that Schema object
const memberSchema = new Schema({
    //define the parameters
    //remember: mongoDB is creating a unique ID for each item
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
        required: true,
    },
    address: {
        type: String,
        required: true
    },
    nic: {
        type: String,
        default: ''
    },
    userType: {
        type: String
    },
    isAvailable: {
        type: Boolean,
        default: true
    }
});

//now convert this schema into a mongoose model/collection to store bookShema type objects.
const Member = mongoose.model("Member", memberSchema)

module.exports = Member;
