const express = require("express");
const cors = require('cors');
const dotenv = require('dotenv').config()
var bodyParser = require('body-parser');
const CronJob = require('cron').CronJob

//Routes
const discordNotification = require("./routes/sendNotification");
const userdata = require("./routes/data");
const { sendNotifications, updateJob } = require('./utils')

// Firebase App

const { initializeApp } = require("firebase/app");
const { doc, getFirestore, collection, addDoc, setDoc, getDocs } = require("firebase/firestore");

const FIREBASE_CONFIG = require('./firebase_config')

const firebaseConfig = FIREBASE_CONFIG;

const server = initializeApp(firebaseConfig);
const db = getFirestore(server);

// Discord Configs


const { Client, Collection, GatewayIntentBits } = require('discord.js');

//Create discord client Object
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers] });
client.login(process.env.token);



// Middlewares
const app = express();
app.use(express.json());
app.use(bodyParser.json());

app.use(cors({
	origin: '*'
}));



//Save Client Object in variable to use it in /sendNotifications
app.set('client', client);


// Routes
app.use("/api", discordNotification);
app.use("/userdata", userdata);


//Sheduling Tasks

/**
 * So the logic is at 00:00 everyday create a cron job at 'setTime' and map that job to 'username'
 * - Job =>  
 * 		//* This will run at the sheduled time only so job will be mapped first to username and then the sheduled job will execute
 * 	 	- send Notification
 * 		- stop the job for the mapped username
 * 		- call updateJob() to update the job
 * 
 * - Map the job to username
 */



let map = [] //map shedule tasks with username

client.on('ready', () => {

	console.log(`Ready! Logged in as ${client.user.tag}`);

	//At midnight
	var job = new CronJob(
		'00 00 00 * * *',
		mapJobs(client),
		null,
		true,
		'Asia/Kolkata'
	);


})


// connection
const port = 5050;
app.listen(port, () => console.log(`Listening to port ${port}`));


// MapJobs
/**
 * create cron jobs for all users and map those jobs to the username
 */
async function mapJobs(client) {

	return new Promise(async (resolve, reject) => {

		try {

			//reference to users collection in db
			const ref = collection(db, 'users/')

			//get all documents
			await getDocs(ref).then((result) => {

				try {

					result.forEach(user => {

						let min = 0, hr = 0
						let newSetTime = user.data().setTime

						//get currentTime in minutes
						let currentTime = new Date().getHours() * 60 + new Date().getMinutes()

						//If the setTime is already elapsed we cannot make scheduled job for that so we need to make shedule job for next possible time considering interval
						if (newSetTime <= currentTime) {

							//new SetTime at which we wanna set the job
							newSetTime = currentTime + ( user.data().interval - ((currentTime - user.data().setTime ) % user.data().interval))

						}

						hr = Math.floor(newSetTime / 60)
						min = newSetTime % 60


						let time = ` ${min} ${hr} * * *`

						console.log(` Job Scheduled for ${user.data().username} at ${time} `);

						//Create a job for the user
						let job = new CronJob(
							time,
							async function () {

								sendNotifications(user.data().username, user.data().email, user.data().discordName, app.settings.client)

								map[user.data().username].job.stop() //Stop the previous job
								await updateJob(user.data().username, hr, min, map, client) //update the job

							},
							null,
							true,
							'Asia/Kolkata'
						);

						//map the current job to username
						map[user.data().username] = { data: user.data(), job, lastRemindedOn: null }

					})

				} catch (e) { }

			})

			app.set('map', map)
			resolve(map)

		} catch (e) {

			console.log(e);
			reject(e)

		}

	})

}




