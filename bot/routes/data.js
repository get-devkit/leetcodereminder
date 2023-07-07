var express = require('express');
var app = express();
const router = express.Router();

const { initializeApp } = require("firebase/app");
const { doc , getFirestore, collection, addDoc, setDoc, getDocs } = require("firebase/firestore");

const FIREBASE_CONFIG = require('../firebase_config')

const firebaseConfig = FIREBASE_CONFIG;

const server = initializeApp(firebaseConfig);
const db = getFirestore(server);


//To Update the data in database ( if username does not exists then it will create one )
router.post('/userInfo', async (req, res) => {
    try {

        // data from client
        var data = req.body

        //Set Data in database according to username
        const ref = doc(db, 'users', data.username)

        setDoc(ref, data).then(() => {

            res.status(200).send("Data Updates")

        }).catch((e) => {

            res.status(500).send("Error Occured" + e)
        })


    } catch (e) {
        console.error("Error while adding user: ", e);
    }

})

module.exports = router