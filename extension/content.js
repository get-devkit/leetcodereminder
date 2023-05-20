

// Recieve Message 
chrome.runtime.onMessage.addListener(async (req, sender, sendResponse) => {

    //Checks if Page is loaded or not
    if (req.loaded) {

        await getUsername().then(async (result) => {

            //Save username in chrome's localstoarge
            await chrome.storage.local.set({ username: result.username }, () => {
                console.log("Username Stored");
            })

            //Send Message to get the userInfo

            await chrome.runtime.sendMessage(sender.id, { userInfo: true, username: result.username })

        }).catch((err) => {
            //send Response as we need to reload again
            console.log(err);
        })
    }

    return true;

})


// Function returns username

async function getUsername() {

    return new Promise((resolve, reject) => {

        const body = document.querySelector('body')

        if (body) {

            let usernameContainer = document.querySelector(".content-wrapper #base_content #profile-app .profile-app__KJyN .header__NyBc .container__28Ei .user-info__2aLr .leetcodeId__13b9");

            // eg :  usernameContainer = " LeetCode ID: xyz "
            let username = ((usernameContainer.textContent).split(':')[1]).trim()

            if (username != null) resolve({ username, status: true })
            reject({ status: false })
        }


    })
}