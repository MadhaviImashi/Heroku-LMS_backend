//import mongoose
const mongoose = require("mongoose");
//assign the Schema object of mongoose into a new const
const Schema = mongoose.Schema;

//create a book schema using that Schema object
const bookSchema = new Schema({
    //define the parameters
    //remember: mongoDB is creating a unique ID for each item
    title: {
        type: String,
        required: true,
    },
    author: {
        type: String,
        required: true,
    },
    isAvailable: {
        type: Boolean,
        default: true
    },
    burrowedMemberId: {
        type: String,
        default: ''
    },
    burrowedDate: {
        type: String,
        default: ''
    }
});

//now convert this schema into a mongoose model/collection to store bookShema type objects.
const Book = mongoose.model("Book", bookSchema)

module.exports = Book;
