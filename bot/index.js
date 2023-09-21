const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv").config();
var bodyParser = require("body-parser");
const CronJob = require("cron").CronJob;
var cookies = require("cookie-parser");



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

const {
  Client,
  Collection,
  GatewayIntentBits,
  channelLink,
} = require("discord.js");

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
app.use(cookies());

app.use(
  cors()
);

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");

  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");

  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization, Cookie"
  );

  res.header("Access-Control-Expose-Headers", "Cookie");

  next();
});


//Save Client Object in variable to use it in /sendNotifications
app.set("client", client);

// Routes
app.use("/api", discordNotification);
app.use("/userdata", userdata);

let map = []; //map shedule tasks with username

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
            let min = 0, hr = 0;

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
              userLocalMidnight.getTime() + user.data().tzOffset * 60000
            );

            //* Get Set Time in UTC

            // Create a Date object representing the local time in UTC
            const setTime = new Date();
            setTime.setHours(Math.floor(user.data().setTime / 60));
            setTime.setMinutes(user.data().setTime % 60);

            // Convert to UTC
            let userSetTime = new Date(
              setTime.getTime() + user.data().tzOffset * 60000
            );

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

            if (currentTime < userSetTime && currentTime > midNight) {
              console.log("Should not notify");
            } else {
              //If the setTime is already elapsed we cannot make scheduled job for that so we need to make shedule job for next possible time considering interval
              if ( userSetTime <= currentTime ) {
                //new SetTime at which we wanna set the job

                userSetTime = ( userSetTime.getHours() * 60 ) + userSetTime.getMinutes()
                currentTime = ( currentTime.getHours() * 60 ) + currentTime.getMinutes()

                userSetTime = currentTime + (user.data().interval - ((currentTime - userSetTime) % user.data().interval)); 
              }

              hr = Math.floor(userSetTime / 60 ).toLocaleString( undefined ,{ minimumIntegerDigits : 2 } )
              min = (userSetTime % 60 ).toLocaleString( undefined ,{ minimumIntegerDigits : 2 } )

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
            }
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
