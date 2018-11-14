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

  // bodyParser, parses the request body to be readable json format
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(bodyParser.json());
  app.use(logger("dev"));

  // Get all data
  router.get("/questions", (req, res) => {
    db.collection("surveys")
      .find({})
      .toArray((err, surveys) => {
        if (err) return next(err);
        res.json(surveys);
      });
  });

  // Create new survey collection from qsf upload.
  router.post("/questions", upload.single("qsf"), (req, res) => {
    // read uploaded qsf file from /uploads
    fs.readFile(req.file.path, (err, data) => {
      if (err) throw err;
      let survey = JSON.parse(data.toString());
      // Create an array of questions for current processed survey
      let questionsArray = [];
      const surveyElements = survey.SurveyElements;

      for (const sq of surveyElements) {
        if (sq.Element === "SQ") {
          // Getting the answers for the questions, placing them in
          // an array.
          let answersArray = [];

          const x = sq.Payload;
          // Filter if chosen Payload has Choices
          if (!x.hasOwnProperty("Choices")) {
            let answer = {
              input: ""
            };
            answersArray.push(answer);
          } else {
            const choices = sq.Payload.Choices;
            // Convert Object into array of objects. (Choices)
            const parsedChoices = Object.keys(choices).map(i => choices[i]);
            for (const a of parsedChoices) {
              answer = {
                input: a.Display
              };
              answersArray.push(answer);
            }
          }

          // Creating the question object and pushing it into an array.
          question = {
            qid: sq.PrimaryAttribute,
            title: sq.SecondaryAttribute,
            answers: answersArray
          };
          questionsArray.push(question);
          // console.table(answersArray);
        }
      }

      // console.table(questionsArray);

      // Insertion
      db.collection("surveys").insertOne(
        {
          sid: survey.SurveyEntry.SurveyID,
          name: survey.SurveyEntry.SurveyName,
          questions: questionsArray
        },
        (err, result) => {
          assert.equal(err, null);
          console.log("File has been uploaded to database.");
        }
      );
    });
    // Once upload is done, local file will be removed.
    fs.unlink(req.file.path, err => {
      if (err) {
        console.log("Failed to unlink qsf file. Err: " + err);
      } else {
        console.log("Removed qsf file after upload...done.");
      }
    });
    // Once all is done, page will reload.
    res.redirect(req.get("referer"));
  });

  // Append api to http request
  app.use("/api", router);

  // Launch backend to port 3001
  app.listen(API_PORT, () =>
    console.log(`Connected! Currently listening ${API_PORT}`)
  );
});
