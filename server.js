// npm i dotenv
require("dotenv").config();

// npm i express
const express = require("express");
const app = express();
app.use(express.json());

// npm i mongoose
const mongoose = require("mongoose");
const User = require("./models/User");

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB Connected");

    app.post("/register", async (req, res) => {
      const { userId, cdn } = req.body;
      await new User({ userId: userId, cdn: cdn }).save();
      res.json({ userId: userId, cdn: cdn });
    });

    app.post("/geturl", async (req, res) => {
      const userId = req.body.userId;
      const user = await User.findOne({ userId: userId });
      if (user) {
        res.json({ cdnURL: user.cdn });
      } else {
        res.status(404).json({ error: "User not found" });
      }
    });

    app.listen(process.env.PORT, () => {
      console.log(`Server listening on port ${process.env.PORT}`);
    });
  })
  .catch((err) => console.log(err));
