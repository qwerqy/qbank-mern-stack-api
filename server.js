const mongoose = require("mongoose");
const express = require("express");
const bodyParser = require("body-parser");
const logger = require("morgan");
const Data = require("./data");

require('dotenv').config()

const API_PORT = 3001;
const app = express();
const router = express.Router();

//MongoDB database
const dbRoute = 'mongodb+srv://qwerqy:amin1234@qbank-vldip.azure.mongodb.net/test?retryWrites=true'

//Connect back end to database
mongoose.connect(
    dbRoute,
    { useNewUrlParser: true }
)

let db = mongoose.connection;

db.once("open", () => console.log('database connected'))