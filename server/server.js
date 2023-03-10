require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();

mongoose.connect(process.env.DB_URL, { useNewUrlParser: true });
const db = mongoose.connection;
db.on("error", (err) => {
  console.error(err);
});
db.once("open", () => {
  console.log("connected to database");
});

app.use(cors());
app.use(express.json());

const purchasesRouter = require("./routes/purchases");
app.use("/api/purchases", purchasesRouter);

app.listen("3000", () => {
  console.log("server started");
});
