import { LeetCode } from "leetcode-query";

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

            console.log(req.body);

            try {
                const leetcode = new LeetCode();
                const user = await leetcode.user(req.body.username);

                if( user.matchedUser === null ) throw new Error('User Not Found')

                res.status(200).json(user.matchedUser)
                
            } catch (err) {
                res.status(500).json(err.message)
            }

        }

  }
  