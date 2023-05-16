

// Recieve Message that page is loaded
chrome.runtime.onMessage.addListener(async (req, sender, response) => {

    if (req.loaded) {
        await getUsername().then((result) => {
            // console.log(result);

            //Save username in chrome's localstoarge

        }).catch((err) => {

            //send response as we need to reload again
            console.log(err);
            response({ reload: true })
        })
    }



})


// Function that returns username
async function getUsername() {

    return new Promise((resolve, reject) => {

        const body = document.querySelector('body')

        if (body) {

            let usernameContainer = document.querySelector(".content-wrapper #base_content #profile-app .profile-app__KJyN .header__NyBc .container__28Ei .user-info__2aLr .leetcodeId__13b9");

            // eg : LeetCode ID: bhaveshanandpara12
            let username = ((usernameContainer.textContent).split(':')[1]).trim()

            if (username != null) resolve({ username, status: true })
            reject({ status: false })
        }


    })
}