var express = require("express");
var app = express();
const router = express.Router();

const { initializeApp } = require("firebase/app");
const {
  doc,
  getFirestore,
  collection,
  addDoc,
  setDoc,
  getDoc,
  deleteDoc,
  getDocs,
} = require("firebase/firestore");

const FIREBASE_CONFIG = require("../firebase_config");

const firebaseConfig = FIREBASE_CONFIG;

const server = initializeApp(firebaseConfig);
const db = getFirestore(server);

const { sendNotifications, updateJob } = require("../utils");
const CronJob = require("cron").CronJob;

//To Update the data in database ( if username does not exists then it will create one )
router.post("/userInfo", async (req, res) => {
  try {
    // data from client
    var data = req.body;

    //Set Data in database according to username
    const ref = doc(db, "users", data.username);

    setDoc(ref, data)
      .then(() => {
        //get the map
        let map = req.app.get("map");

        //If status is true ( problem is solved so no need to schedule now )
        if (data.status) {
          try {
            if (map[data.username].job != null) {
              map[data.username].job.stop();
              map[data.username] = null;
              console.log("All Jobs terminated for " + data.username);
              res.status(200).send("Data Updated");
              return;
            }
          } catch (e) {
            console.log(`error occured stopping job for ${data.username}`);
            console.log(e);
          }
        }

        //If setTime is not defined then no need to create job
        if (data.setTime === null || data.setTime === undefined) {
          res.status(200).send("Data Updated");
          return;
        }

        try {
          let min = 0,
            hr = 0;

          //* Get Midnight Time in UTC

          // Create a date object representing the user's local midnight time
          const now = new Date();

          const userLocalMidnight = new Date(
            now.getFullYear(),
            now.getMonth(),
            now.getDate(),
            0, // Midnight hour
            0, // Midnight minute
            0, // Midnight second
            0 // Midnight millisecond
          );

          // Convert to UTC
          let midNight = new Date(
            userLocalMidnight.getTime() + data.tzOffset * 60000
          );

          //* Get Set Time in UTC

          // Create a Date object representing the local time in UTC
          const setTime = new Date();
          setTime.setHours(Math.floor(data.setTime / 60));
          setTime.setMinutes(data.setTime % 60);

          // Convert to UTC
          let userSetTime = new Date(setTime.getTime() + data.tzOffset * 60000);

          // Create an Intl.DateTimeFormat object with the user's time zone
          const setTimeFormatter = new Intl.DateTimeFormat("en-US", {
            hour12: false, // Use 24-hour format
            year: "numeric",
            month: "numeric",
            day: "numeric",
            hour: "numeric",
            minute: "numeric",
            second: "numeric",
          });

          // Format the user's local midnight time in UTC time
          userSetTime = setTimeFormatter.format(userSetTime);
          userSetTime = new Date(userSetTime);

          //* get Current Time in UTC

          let currentTime = new Date();

          // console.log(midNight.getHours() + ":" + midNight.getMinutes()); //! for debugging
          // console.log( currentTime.getHours() + ":" + currentTime.getMinutes() ); //! for debugging
          // console.log( userSetTime.getHours() + ":" + userSetTime.getMinutes() ); //! for debugging


          userSetTime = userSetTime.getHours() * 60 + userSetTime.getMinutes();
          currentTime = currentTime.getHours() * 60 + currentTime.getMinutes();

            //If the setTime is already elapsed we cannot make scheduled job for that so we need to make shedule job for next possible time considering interval
            if (userSetTime <= currentTime) {
              //new SetTime at which we wanna set the job
              userSetTime = currentTime + (data.interval - ((currentTime - userSetTime) % data.interval));

            }

            hr = Math.floor(userSetTime / 60).toLocaleString(undefined, {
              minimumIntegerDigits: 2,
            });
            min = (userSetTime % 60).toLocaleString(undefined, {
              minimumIntegerDigits: 2,
            });

            let time = ` ${min} ${hr} * * *`;

            console.log(` Job Scheduled for ${data.username} at ${time} `);

            //Create a job for the new SetTime
            let job = new CronJob(
              time,
              async function () {
                let client = req.app.get("client");

                try {
                  map[data.username].job.stop(); // stop the current job
                } catch (e) {
                  console.log(`No job found for ${data.username}`); //! for debugging
                }

                // update job
                await updateJob(
                  data.username,
                  data.interval,
                  parseInt(hr),
                  parseInt(min),
                  map,
                  client
                );

                await sendNotifications(
                  data.username,
                  data.email,
                  data.discordName,
                  client
                ).catch((e) => console.log(e));
              },
              null,
              true
            );

            try {
              if (map[data.username].job != undefined)  map[data.username].job.stop();
              map[data.username].job = job;

            } catch (e) {
              // console.log(`No job found for ${username}`); //! debugging
            }

            res.status(200).send("Data Updated");
          
        } catch (e) {
          console.log(e);
          res.status(500).send("data Added but job not update");
        }
      })
      .catch((e) => {
        res.status(500).send("Error Occured" + e);
      });
  } catch (e) {
    console.error("Error while adding user: ", e);
  }
});

router.get("/userInfo", async (req, res) => {
  const username = req.query.username;

  const querySnapshot = await getDoc(doc(db, "users", username));

  if (querySnapshot.data() === undefined)
    res.status(503).json("Data not available");
  else res.status(200).json(querySnapshot.data());
});

router.delete("/user", async (req, res) => {
  const username = req.query.username;

  try {
    const querySnapshot = await deleteDoc(doc(db, "users", username));
    res.status(200).json("Deleted Successfully");
  } catch (e) {
    res.status(500).json("Error Occured while deleting doc from database");
  }
});

module.exports = router;
