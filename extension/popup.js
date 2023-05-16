//----------------------------- Variables ------------------------------------ //

const serverProxy = 'https://leetcodereminder.vercel.app/api'


main() // calling main function


async function main() {


    //Check whether we have info for Leetcode profile
    let haveInfo = await haveUserInfo();


    if (!haveInfo) loginPrompt()
    else showPopup()

}



//----------------------------- Utilities function ------------------------------------ //

//Returns true if we have user info otherwise false
function haveUserInfo() {

    return new Promise(async (resolve, reject) => {

        try {

            //Check if we have userInfo in chrome storage
            let userInfo = await chrome.storage.local.get('userInfo')

            if (userInfo.userInfo === undefined) resolve(false);
            else resolve(true)

        } catch (err) {

            reject(err)

        }

    })

}

//----------------------------- HTML Snippets -------------------------------------//

//Returns HTML Component for prompting user to open leetcode profile page
function loginPrompt() {


    let comp = document.createElement('p')
    comp.innerHTML = "Click on <a class='link' target='_blank' href='https://leetcode.com/profile/'>Leetcode Profile</a> to Login"

    document.body.innerHTML = comp.outerHTML

}


async function showPopup() {

    console.log(await chrome.storage.local.get('username'));

    console.log("POpup");

}



//----------------------------- API CALLS -------------------------------------//

//Function to get userDetails

async function getUSerDetails(username) {

    return new Promise(async (resolve, reject) => {


        // Get User Details
        const response = await fetch(`${serverProxy}/getUserDetails`, {

            method: "POST",
            headers: {
                "Content-Type": "application/json",
                // 'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: JSON.stringify({ username })

        })


        await response.json().then((result) => {

            resolve(result)

        }).catch((err) => {
            reject(err)
        })

    })

}