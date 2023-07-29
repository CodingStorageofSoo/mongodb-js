// npm i dotenv
require("dotenv").config();

// npm i express
const express = require("express");
const app = express();

// npm i mongoose
const mongoose = require("mongoose");

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB Connected");
    app.listen(process.env.PORT, () => {
      console.log(`Server listening on port ${process.env.PORT}`);
    });
  })
  .catch((err) => console.log(err));
