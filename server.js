//import express pckg which helps to manage routes, to handle requests and views
const express = require("express");
//import mongoose which can be used to create schemas to build up relationship between our node.js codebase and the mongoDB
const mongoose = require("mongoose");
//import 2 mongoose collections
const Book = require("./models/book")
const Member = require("./models/member")
//import cors 3rd party pckg- to enable communication between 2 different host platforms(firebase, heroku)
const cors = require("cors");

//create a server using Express.js
const server = express();

const databaseURl = "mongodb+srv://sparkCluster:wyyNNMTDdh9K4KM@lmscluster.l7mvt.mongodb.net/sparkBackendDB?retryWrites=true&w=majority";

//specify the port 
const PORT = process.env.PORT || 3000

//connect mongoose with our server
mongoose.connect(databaseURl, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then((result) => {
  console.log("connected to DB");
  //start server listening to http requests only if server is connected to DB
  server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}).catch((error) => {
  console.log(error);
  })

//add a cors parameter to each request header
server.use(cors());
//hence post request URL is encoded, we need to first decode them
server.use(express.urlencoded({ extended: true }));
//specify the type of request data as JSON
server.use(express.json());

// /book :View all books
server.get("/book", async (req, res) => {
  const response = await Book.find();
  res.send(response)
});

// /book/:id : get single book
server.get("/book/:id", async (req, res) => {
  const id = req.params.id;
  const response = await Book.findById(id);
  console.log(response);
  res.send(response)
});

// /book: : Post: add book
// title, author
server.post("/book", async (req, res) => {
  const { title, author } = req.body;

  //create a book object using mongoDB function- save()
  const book_obj = new Book({ title, author });

  const response = await book_obj.save(); //have to wait cuz this is an Async function
  console.log(response)
  res.send(response)
});

// /book/:id/burrow : burrow book
// book/1/burrow
// burrowedMemberId, burrowedDate
server.put("/book/:id/burrow", async (req, res) => {
  const id = req.params.id;
  const { burrowedMemberId, burrowedDate } = req.body;

  const burrowedBook = await Book.findByIdAndUpdate(id, {
    isAvailable: false,
    burrowedMemberId,
    burrowedDate
  });

  res.send(burrowedBook)
});

// /book/:id/return : return book
// /book/1/return
server.put("/book/:id/return", async (req, res) => {
  const id = req.params.id;

  const returnedBook = await Book.findByIdAndUpdate(id, {
    isAvailable: true,
    burrowedMemberId: '',
    burrowedDate: ''
  });

  res.send(returnedBook);
});

// /book/:id Put: Edit a book
// title, autor
server.put("/book/:id", async(req, res) => {
  const id = req.params.id;
  const { title, author } = req.body;

  const updatedBook = await Book.findByIdAndUpdate(id, {
    title: title,
    author: author
  });
  res.send(updatedBook);
});

// /book/:id :Delete: Delete book
// /book/1
server.delete("/book/:id", async (req, res) => {
  const id = req.params.id;

  const deletedBook = await Book.findByIdAndDelete(id);
  res.send(deletedBook);
});

//---------------------------------------------------------------------for Members--------------------------------------------------------

// let members = [
//   {
//     id: "1",
//     firstName: "Imashi",
//     lastName: "Uyanahewa",
//     phone: "+94 77 123 5869",
//     address: "dkdkdk",
//     nic: "995079223v",
//     userType: "",
//     isAvailable: true,
//   },
//   {
//     id: "2",
//     firstName: "Pavani",
//     lastName: "Fernando",
//     phone: "+94 77 123 5869",
//     address: "dkdkdk",
//     nic: "995279223v",
//     userType: "",
//     isAvailable: true,
//   },
//   {
//     id: "3",
//     firstName: "Hashani",
//     lastName: "Gamage",
//     phone: "+94 77 123 5869",
//     address: "dkddfdkdk",
//     nic: "995073223v",
//     userType: "",
//     isAvailable: true,
//   },
//   {
//     id: "4",
//     firstName: "Sahasra",
//     lastName: "Withanage",
//     phone: "+94 77 123 5869",
//     address: "dkdkdf dk",
//     nic: "998079223v",
//     userType: "",
//     isAvailable: true,
//   },
// ];

// /member : view all members
server.get("/member", async (req, res) => {
  const members = await Member.find()
  res.send(members);
});

// /member/:id : view single member
// /member/1
server.get("/member/:id", async (req, res) => {
  const id = req.params.id;
  const member = await Member.findById(id);
  res.send(member);
});

// /member : add new member
server.post("/member", async(req, res) => {
  const { firstName, lastName, phone, address, nic, userType } = req.body;

  const member_Obj = new Member({
    firstName,
    lastName,
    phone,
    address,
    nic,
    userType
  });
  const response = await member_Obj.save();
  res.send(response);
});

// /member/:id : edit member details
// /member/1
server.put("/member/:id", async (req, res) => {
  const id = req.params.id;
  const { firstName, lastName, phone, address, nic, userType} = req.body;

  const updatedMember = await Member.findByIdAndUpdate(id, {
    firstName,
    lastName,
    phone,
    address,
    nic,
    userType
  });
  res.send(updatedMember);
});

// /member/:id : delete member
// /member/1
server.delete("/member/:id", async (req, res) => {
  const id = req.params.id;

  //filter function will iterate the members array and filter the members of which the id is not equal to the param.id
  // which simply replace the old array with a new one which doesn't contain the member of which the id is equal to param.id

  // members = members.filter((member) => member.id !== id);
  // res.send(id);
  const deletedMember = await Member.findByIdAndDelete(id);
  res.send(deletedMember);
});


//set 404 msg as the default route
server.use((req, res) => {
    res.type("txt");
    res.send("404 not found");
});