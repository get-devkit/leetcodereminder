const dotenv = require('dotenv').config();
const asyncHandler = require("express-async-handler");
var CryptoJS = require("crypto-js");


const verifyUser = asyncHandler(async (req, res, next) => {

    let username = req.query.username || req.body.username
    
    // extracting token from req headers
    const token =  req.cookies['x-access-token'] || req.body.accessToken;

        try{

        // Decrypt
        var bytes  = CryptoJS.AES.decrypt(token, process.env.SECRET_KEY);
        var originalText = bytes.toString(CryptoJS.enc.Utf8);
        
        // if( req.body.accessToken != null || req.body.accessToken ){
        //     delete req.body.accessToken
        // }

        if( username == originalText ) next();
        else throw new Error( "Not Authorized" );

        }
        catch (err) {
            next(err);
        }
})

module.exports = verifyUser;