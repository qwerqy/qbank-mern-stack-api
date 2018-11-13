const mongoose = require("mongoose");
const express = require("express");
const bodyParser = require("body-parser");
const logger = require("morgan");
const Data = require("./data");

require("dotenv").config();

const API_PORT = 3001;
const app = express();
const router = express.Router();

//MongoDB database
const dbRoute =
  "mongodb+srv://qwerqy:amin1234@qbank-vldip.azure.mongodb.net/test?retryWrites=true";

//Connect back end to database
mongoose.connect(
  dbRoute,
  { useNewUrlParser: true }
);

let db = mongoose.connection;

db.once("open", () => console.log("database connected"));

// if connection is unsuccessful
db.on("error", console.error.bind(console, "MongoDB Connection Error"));

// bodyParser, parses the request body to be readable json format
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(logger("dev"));

// Get all data
router.get("/questions", (req, res) => {
  Data.find((err, data) => {
    if (err) return res.json({ success: false, error: err });
    return res.json({ success: true, data: data });
  });
});

// Append api to http request
app.use("/api", router);

// Launch backend to port 3001
app.listen(API_PORT, () =>
  console.log(`Connected! Currently listening ${API_PORT}`)
);
