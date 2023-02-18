const express = require("express");
const cors = require("cors");
require("dotenv").config();
const app = express();

const corsOptions = {
  origin: "*",
  credentials: true,
  optionSuccessStatus: 200,
};

//errors
const errorHandlerMiddleware = require("./errors/errorHandlerMiddleware");

//routes
const routerPrijave = require("./routes/prijave");

//db
const connectDB = require("./db/connect.js");

//midleware
app.use(cors(corsOptions)); // Use this after the variable declaration
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  next();
});
app.use(express.json());
app.get("/", (req, res) => {
  res.send("Api is running");
});

//routes
app.use("/prijave/api", routerPrijave);

//errors
app.use(errorHandlerMiddleware);

//server start
const startServer = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    let PORT = process.env.PORT || 5001;
    app.listen(PORT, () => {
      console.log("server on port: " + PORT);
    });
  } catch (error) {
    console.log(`There is a problem with a server:${error}`);
  }
};

startServer();
