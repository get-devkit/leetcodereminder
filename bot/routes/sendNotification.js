const express = require('express');
const app = express();

const bodyParser = require('body-parser');

const cors = require('cors');

const dotenv = require("dotenv")
dotenv.config()


app.use(bodyParser.json());


app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.header("Access-Control-Allow-Headers", "x-access-token, Origin, X-Requested-With, Content-Type, Accept , token");
    next();
});


app.post('/sendNotification', async (req, res) => {

    try{

    let client = req.app.get('client');
    let username = req.body.username
    let flag = false

    let guild = await  client.guilds.fetch(process.env.guildId)
    const users = await guild.members.fetch()

    

    users.forEach(element => {

        console.log(element);

        if(element.user.username === username){

    	    element.send( "Leetcode Reminder !!" )
            flag = true
            res.status(200).json('Msg Send Successfully')
        }
        
    });

    if( !flag )
        throw new Error('User not Found')
        

}catch(err){
    console.log(err.message);
    res.status(500).json(err.message)
}


})

module.exports = app