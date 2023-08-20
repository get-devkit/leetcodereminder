const dotenv = require('dotenv').config()


const FIREBASE_CONFIG = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: "leetcodereminder-4b532.firebaseapp.com",
  projectId: "leetcodereminder-4b532",
  storageBucket: "leetcodereminder-4b532.appspot.com",
  messagingSenderId: "843122286304",
  appId: "1:843122286304:web:633b73cdcfbc6b7e65ba85",
  measurementId: "G-QPKZX505S6"
  };

  
module.exports = FIREBASE_CONFIG

