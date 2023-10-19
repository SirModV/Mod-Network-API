const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const userRouter = require("./routers/userRouter");
const thoughtRouter = require("./routers/thoughtRouter");




require("dotenv").config();

//set up server
const app = express();

const PORT = process.env.PORT || 3001;
app.use(express.json());

//connection to DB
const uri = process.env.MDB;
mongoose.set('strictQuery', false);
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
const connection = mongoose.connection;
connection.once("open", () => {
  console.log("MongoDB database connection established successfully");
});

//using local server
app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({
  extended: true
}));


//set up routes

app.use('/api/users',  userRouter)
app.use('/api/thoughts',  thoughtRouter)




app.get('/', (req, res)=>{
res.send(
  "App is running!"
)
})
