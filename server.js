// npm i dotenv
require("dotenv").config();

// npm i express
const express = require("express");
const app = express();
app.use(express.json());

const { v4: uuidv4 } = require("uuid");

// npm i mongoose
const mongoose = require("mongoose");
const User = require("./models/User");
const Log = require("./models/Log");

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

    app.post("/register-log", async (req, res) => {
      const data = {
        id: uuidv4(),
        winner: req.body,
        firePixel: "false",
        click: "false",
      };
      await new Log(data).save();
      res.json(data);
    });

    app.get("/update/:id", async (req, res) => {
      try {
        const updatedLog = await Log.findOneAndUpdate(
          { id: req.params.id },
          { $set: { firePixel: "true" } },
          { new: true } // Return the updated document
        );

        if (updatedLog) {
          console.log("Document updated successfully");
          console.log(updatedLog);
          res.json({ message: "Document updated successfully" });
        } else {
          res.status(404).json({ error: "Document not found" });
        }
      } catch (err) {
        console.error("Error updating document:", err);
        res.status(500).json({ error: "Internal server error" });
      }
    });

    app.listen(process.env.PORT, () => {
      console.log(`Server listening on port ${process.env.PORT}`);
    });
  })
  .catch((err) => console.log(err));
