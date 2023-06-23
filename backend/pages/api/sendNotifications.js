const dotenv = require('dotenv').config()
import Mail from '@/Utils/sendMail'
import validateEmail from '@/Utils/validateEmail'

export default async function handler(req, res) {


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

            const email = req.body.email
            const randomQue = req.body.randomQue
            const image = req.body.catImage

            try {

                if( validateEmail( email ) ){

                    //Send the Email
                    Mail.sendMail( email , randomQue , catImage ).then(()=>{
                        res.status(200).json('Email sent Successfully')
                    }).catch((err)=>{
                        res.status(500).json('Email not sent')
                    })

                }

                
            } catch (err) {
                res.status(500).json(err.message)
            }

        }

  }
  