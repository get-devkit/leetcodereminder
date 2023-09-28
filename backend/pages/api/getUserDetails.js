import { LeetCode } from "leetcode-query";
let CryptoJS = require("crypto-js");
const dotenv = require('dotenv').config()

export default async function handler(req, res) {
  //if GET method throws error

  if (req.method === "GET") {
    try {
      throw new Error(" GET request are not allowed ");
    } catch (err) {
      res.status(500).json(err.message);
    }
  }

  //Finds the user and return the user information
  if (req.method === "POST") {
    // console.log(req.body); //! debugging

    try {
      const leetcode = new LeetCode();
      const user = await leetcode.user(req.body.username);

      if (user.matchedUser === null) throw new Error("User Not Found");

      // Encrypt
      let accessToken = CryptoJS.AES.encrypt(
        req.body.username,
        process.env.SECRET_KEY
      ).toString();

      user.matchedUser['accessToken'] = accessToken;

      res.status(200).json(user.matchedUser);

    } catch (err) {
      console.log(err);
      res.status(500).json(err.message);
    }
  }
}
