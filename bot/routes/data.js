var express = require('express');
var app = express();
const router = express.Router();

const { initializeApp } = require("firebase/app");
const { doc, getFirestore, collection, addDoc, setDoc, getDocs } = require("firebase/firestore");

const FIREBASE_CONFIG = require('../firebase_config')

const firebaseConfig = FIREBASE_CONFIG;

const server = initializeApp(firebaseConfig);
const db = getFirestore(server);

const { sendNotifications, updateJob } = require('../utils')
const CronJob = require('cron').CronJob


//To Update the data in database ( if username does not exists then it will create one )
router.post('/userInfo', async (req, res) => {
    try {

        // data from client
        var data = req.body

        //Set Data in database according to username
        const ref = doc(db, 'users', data.username)

        setDoc(ref, data).then(() => {

            //get the map
            let map = req.app.get('map')

            //If status is true ( problem is solved so no need to schedule now )
            if (data.status) {

                if (map[data.username].job != null) {

                    map[data.username].job.stop()
                    map[data.username] = null
                    console.log( "Jobs terminated for " + data.username );
                    res.status(200).send("Data Updated")
                    return

                }

            }

            //If setTime is not defined then no need to create job
            if (data.setTime === null || data.setTime === undefined) {
                res.status(200).send("Data Updated")
                return
            }

            //get currentTime in minutes
            let currentTime = new Date().getHours() * 60 + new Date().getMinutes()

            try {


                let min = 0, hr = 0
                let newSetTime = data.setTime

                //If the setTime is already elapsed we cannot make scheduled job for that so we need to make shedule job for next possible time considering interval
                if (data.setTime <= currentTime) {

                    //new SetTime at which we wanna set the job
                    newSetTime = currentTime + (data.interval - ((currentTime - data.setTime) % data.interval))

                }

                hr = Math.floor(newSetTime / 60)
                min = newSetTime % 60

                let time = `${min} ${hr} * * *`

                console.log(` Job Scheduled for ${data.username} at ${time} `);

                //Create a job for the new SetTime
                let job = new CronJob(
                    time,
                    async function () {

                        let client = req.app.get('client');
                        await sendNotifications(data.username, data.email, data.discordName, client).catch(e=> console.log(e))

                        map[data.username].job.stop() // stop the current job
                        await updateJob(data.username, hr, min, map, client) // update job

                    },
                    null,
                    true,
                );

                res.status(200).send("Data Updated")

            } catch (e) {
                console.log(e);
                res.status(500).send("data Added but job noy update")

            }



        }).catch((e) => {

            res.status(500).send("Error Occured" + e)
        })


    } catch (e) {
        console.error("Error while adding user: ", e);
    }

})

module.exports = router