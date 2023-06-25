const dotenv = require('dotenv').config()
import Mail from '@/Utils/sendMail'
import validateEmail from '@/Utils/validateEmail'
import NextCors from 'nextjs-cors';

export default async function handler(req, res) {

    await NextCors(req, res, {
        // Options
        methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
        origin: '*',
        optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
     });
  

        //if GET method throws error

        if( req.method === "GET" ){

            try{

                throw new Error(' GET request are not allowed ')

            }catch( err ){

                res.status(500).json( err.message )

            }

        }
    
        //Finds the user and return the user information
        if( req.method === "POST" ){

            console.log(req.body);

            const email = req.body.email
            const randomQue = req.body.randomQue
            const image = req.body.catImage

            try {

                if( validateEmail( email ) ){

                    //Send the Email
                    Mail.sendMail( email , randomQue , image ).then(()=>{
                        res.status(200).json('Email sent Successfully')
                    }).catch((err)=>{
                        console.log(err);
                        res.status(500).json('Email not sent')
                    })

                }

                
            } catch (err) {
                res.status(500).json(err.message)
            }

        }

  }
  