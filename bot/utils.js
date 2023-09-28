const nodemailer = require("nodemailer");
const dotenv = require("dotenv").config();
const axios = require("axios");
const CronJob = require("cron").CronJob;
const { emailMsg, discordMessage } = require("./message");
const {
  doc,
  getFirestore,
  collection,
  addDoc,
  setDoc,
  getDoc,
} = require("firebase/firestore");

/**
 *  SendNotifications send notifications across emails and disocrd DM
 */
const sendNotifications = async (
  username,
  email = null,
  discordName = null,
  client
) => {
  return new Promise(async (resolve, reject) => {
    try {
      // console.log(` Send Notifications to ${email} and ${discordName} for ${username}`); //! debugging

      if (email !== null) {
        await SendMailNotification(email).catch((err) =>
          console.log(err.message)
        );
      }

      if (discordName === null) return;

      //Send Discord Notifications
      await SendDiscordNotification(client, discordName).catch((err) =>
        console.log(err.message)
      );

      resolve("");

    } catch (e) {
      reject(e.message);
    }
  });
};

/**
 *  SendDiscordNotification sends message across Discord DM
 */

async function SendDiscordNotification(client, name) {
  return new Promise(async (resolve, reject) => {
    try {
      let username = name;

      //guild ==> Server in discord
      let guild = await client.guilds.fetch(process.env.guildId);

      guild.members.fetch().then((m) => {
        let members = m.map(async function (u) {
          let discordMsg = discordMessage();

          //Check if the discord username exists or not
          if (u.user.username === username) {
            if (u.user) {
              let user = await client.users.fetch(u.user.id);
              await user.send(discordMsg);
            }

            // console.log("Discord Notification Send Successfully") //! debugging
            resolve("");
          }
        });
      });
    } catch (err) {
      console.log(err.message);
      reject(err);
    }
  });
}

/**
 *  SendMailNotification sends message across mail
 */
async function SendMailNotification(email) {
  return new Promise(async (resolve, reject) => {
    const transporter = nodemailer.createTransport({
      port: 465,
      host: "smtp.gmail.com",
      auth: {
        user: process.env.NEXT_PUBLIC_NODEMAILER_EMAIL,
        pass: process.env.NEXT_PUBLIC_NODEMAILER_PASS,
      },

      secure: true,
    });

    let emailInfo = await emailMsg();

    const mailData = {
      from: process.env.NEXT_PUBLIC_NODEMAILER_EMAIL,
      to: email,
      subject: emailInfo.sub,
      html: emailInfo.body,
    };

    transporter.sendMail(mailData, function (err, info) {
      if (err) {
        console.log(err);
        reject(err);
      } else {
        // console.log("Email Sent Successfully"); //! debugging
        resolve(info);
      }
    });
  });
}

/**
 * updateJob() will update the current cron job mapped to username
 */

async function updateJob(username, accessToken, interval, hr, min, map, client) {
  //Update the time
  hr = Math.floor(hr + (min + interval) / 60).toLocaleString(undefined, {
    minimumIntegerDigits: 2,
  });

  min = ((min + interval) % 60).toLocaleString(undefined, {
    minimumIntegerDigits: 2,
  });


  let time = ` ${min} ${hr} * * *`;

  console.log(` New Job  Scheduled for ${username} at ${time} `);

  //Create a job for the user
  let job = new CronJob(
    time,
    async function () {
      try {

        //check for the status of solved question
        let status = await isSolved( username , accessToken )

        // console.log(status); //!debugging

        if( status ){

          //stop the job
          map[username].job.stop()
          map[username].job = undefined
          console.log( `Job suspended for ${username}`  );
          return;

        }


        await sendNotifications(
          map[username].data.username,
          map[username].data.email,
          map[username].data.discordName,
          client
        );

        map[username].job.stop(); // stop the current job
        await updateJob(
          username,
          accessToken,
          interval,
          parseInt(hr),
          parseInt(min),
          map,
          client
        ); // update job
      } catch (e) {
        console.log(e);
      }
    },
    null,
    true
  );

  try {
    map[username].job = job;
  } catch (e) {
    // console.log(`No job found for ${username}`); //! debugging
  }
}

//Returns status for the current day whether the user has solved today or not
async function isSolved(username , accessToken) {

  return new Promise(async (resolve, reject) => {

    try {

      const URL = `https://leetcodereminder-ten.vercel.app/api/getUserDetails`;

      await axios
        .post(URL , {username , accessToken} )
        .then(async (response) => {

          const calendar = JSON.parse(response.data.submissionCalendar);
          
          //In Provided API the days are stored in timestamp format at the begging of day
          let today = new Date();
          today.setUTCHours(0, 0, 0, 0); // Set for the Today at 00:00:00
          today = today.getTime() / 1000; // get Timestamp
    
          if (calendar["" + today] === undefined) {
            resolve(false);
          } else {
            resolve(true);
          }


        })
        .catch((error) => {
          console.log(error);
          reject(true)
        });

    } catch (e) {
      console.log(e);
      reject(true);
    }
  });
}


module.exports = { sendNotifications, updateJob };
