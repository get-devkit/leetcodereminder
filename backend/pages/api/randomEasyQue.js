import { LeetCode } from "leetcode-query";
import Que from "@/que";

export default async function handler(req, res) {


        //if GET method throws error

        if( req.method === "GET" ){

            try {

                let arr = Que.stat_status_pairs
                let limit = arr.length
        
                while (true) {
        
                    let item = arr[Math.floor(Math.random() * limit)]
                    if (item.difficulty.level === 1) {
                        res.status(200).json(item.stat.question__title_slug)
                        break;
                    }
                }
                
            } catch (err) {

                res.status(500).json(err.message)

            }

        }
    
        //Finds the user and return the user information
        if( req.method === "POST" ){

            try{

                throw new Error(' POST request are not allowed ')

            }catch( err ){

                res.status(500).json( err.message )

            }

        }

  }
  