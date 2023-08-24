const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv").config();
var bodyParser = require("body-parser");
const CronJob = require("cron").CronJob;

//Routes
const discordNotification = require("./routes/sendNotification");
const userdata = require("./routes/data");
const { sendNotifications, updateJob } = require("./utils");

// Firebase App

const { initializeApp } = require("firebase/app");
const {
  doc,
  getFirestore,
  collection,
  addDoc,
  setDoc,
  getDocs,
} = require("firebase/firestore");

const FIREBASE_CONFIG = require("./firebase_config");

const firebaseConfig = FIREBASE_CONFIG;

const server = initializeApp(firebaseConfig);
const db = getFirestore(server);

// Discord Configs

const { Client, Collection, GatewayIntentBits } = require("discord.js");

//Create discord client Object
const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers],
});

try {
  client.login(process.env.token);
} catch (e) {
  console.log("error while installing bot on server"); //! remove this later
  console.log(e);
}

// Middlewares
const app = express();
app.use(express.json());
app.use(bodyParser.json());

app.use(
  cors({
    origin: "*",
  })
);

//Save Client Object in variable to use it in /sendNotifications
app.set("client", client);

// Routes
app.use("/api", discordNotification);
app.use("/userdata", userdata);

let map = []; //map shedule tasks with username

console.log(JSON.stringify(map)); //! remove this later

client.on("ready", () => {
  console.log(`Ready! Logged in as ${client.user.tag}`);

  //At midnight
  var job = new CronJob("00 00 00 * * *", mapJobs(client), null, true, "UTC");
});

// connection
const port = 10000;
app.listen(port, () => console.log(`Listening to port ${port}`));

// MapJobs
/**
 * create cron jobs for all users and map those jobs to the username
 */
async function mapJobs(client) {
  return new Promise(async (resolve, reject) => {
    try {
      //reference to users collection in db
      const ref = collection(db, "users/");

      //get all documents
      await getDocs(ref).then((result) => {
        console.log("Assigned by index.js");

        try {
          result.forEach((user) => {
            let min = 0,
              hr = 0;

            //Time According to user timezone
            let newSetTime = user.data().setTime;

            //Getting Current Time according to user's timezone
            let utcDate = new Date();

            // Convert UTC date to user's time zone
            const userDate = new Date(
              utcDate.toLocaleString("en-US", { timeZone: user.data().timezone })
            );

            // Format the date in 24-hour format
            const formattedDate = `${userDate
              .getHours()
              .toString()
              .padStart(2, "0")}:${userDate
              .getMinutes()
              .toString()
              .padStart(2, "0")}`;

            let currHr = parseInt(formattedDate.split(':')[0])
            let currMin = parseInt(formattedDate.split(':')[1])

            //get Current Time according to user's timezone
            let currentTime = currHr * 60 + currMin;

            // console.log( Math.floor(currentTime / 60) + ":" + (currentTime % 60) ); //! for debugging
            // console.log(Math.floor(newSetTime / 60) + ":" + (newSetTime % 60)); //! for debugging

            //If the setTime is already elapsed we cannot make scheduled job for that so we need to make shedule job for next possible time considering interval
            if (newSetTime <= currentTime) {
              //new SetTime at which we wanna set the job
              newSetTime = currentTime + (user.data().interval - ((currentTime - user.data().setTime) % user.data().interval));
            }

            hr = Math.floor(newSetTime / 60).toLocaleString(undefined, {
              minimumIntegerDigits: 2,
            });
            min = (newSetTime % 60).toLocaleString(undefined, {
              minimumIntegerDigits: 2,
            });

            let time = ` ${min} ${hr} * * *`;

            console.log(
              ` Job Scheduled for ${user.data().username} at ${time} `
            ); 

            //Create a job for the user
            let job = new CronJob(
              time,
              async function () {
                //update the job

                await updateJob(
                  user.data().username,
                  user.data().interval,
                  parseInt(hr),
                  parseInt(min),
                  map,
                  client
                );

                sendNotifications(
                  user.data().username,
                  user.data().email,
                  user.data().discordName,
                  app.settings.client
                );

                map[user.data().username].job.stop(); //Stop the previous job
              },
              null,
              true
            );

            //map the current job to username
            map[user.data().username] = {
              data: user.data(),
              job,
              lastRemindedOn: null,
            };
          });
        } catch (e) {}
      });

      app.set("map", map);
      resolve(map);
    } catch (e) {
      console.log(e);
      reject(e);
    }
  });
}
