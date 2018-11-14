const MongoClient = require("mongodb").MongoClient;
const assert = require("assert");
const express = require("express");
const bodyParser = require("body-parser");
const logger = require("morgan");
const multer = require("multer");
const fs = require("fs");
const upload = multer({ dest: "uploads/" });

require("dotenv").config();

const API_PORT = 3001;
const app = express();
const router = express.Router();

//MongoDB database
const url =
  "mongodb+srv://qwerqy:amin1234@qbank-vldip.azure.mongodb.net/test?retryWrites=true";

//Database Name
const dbName = "qbank";

//Creates a new MongoClient
const client = new MongoClient(url, { useNewUrlParser: true });

//Connect server to database in cloud
client.connect(err => {
  assert.equal(null, err);
  console.log("Connected successfully to server.");

  const db = client.db(dbName);

  client.close();
});

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

router.post("/questions", upload.single("qsf"), (req, res) => {
  fs.readFile(req.file.path, (err, data) => {
    if (err) throw err;
    console.log(data.toString());
  });
});

// Append api to http request
app.use("/api", router);

// Launch backend to port 3001
app.listen(API_PORT, () =>
  console.log(`Connected! Currently listening ${API_PORT}`)
);
