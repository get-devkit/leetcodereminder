const express = require("express");
const home = require("./routes/sendNotification");
const cors = require('cors');
const dotenv = require('dotenv').config()

const { Client, Collection, GatewayIntentBits } = require('discord.js');

//Create discord client Object
const client = new Client({ intents: [GatewayIntentBits.Guilds , GatewayIntentBits.GuildMembers,] });
client.login(process.env.token);


client.on('ready' , ()=>{
	console.log(`Ready! Logged in as ${client.user.tag}`);
})

// Middlewares
const app = express();
app.use(express.json());

app.use(cors({
	origin: '*'
}));  


//Save Client Object in variable to use it in /sendNotifications
app.set('client', client);


// Routes
app.use("/api", home);

// connection
const port = 5050;
app.listen(port, () => console.log(`Listening to port ${port}`));