
//*----------------------------- Variables ------------------------------------ *//

const serverProxy = 'https://leetcodereminder.vercel.app/api'


//Checking Whether the Tab is Leetcode Profile and if yes then send the message to get the username
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {

    chrome.tabs.get(tabId).then((result) => {

        // console.log(result);

        //if the the webpage is leetcode profile page and loading is complete
        if (result.url === "https://leetcode.com/profile/" && result.status === 'complete') {

            //Send Message to content script that page is loded
            chrome.tabs.sendMessage(result.id, { loaded: true })
        }

    }).catch((err) => {
        console.log(err);
    });

});


// Recieve Messages
chrome.runtime.onMessage.addListener(async (req, sender, sendResponse) => {

    //Checks if we need to get userInfo or not
    if (req.userInfo) {

        // console.log(JSON.stringify({ username: req.username }));


        //* Calling API to getUserInfo *//


        // Get User Details
        const response = await fetch(`${serverProxy}/getUserDetails`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ username: req.username })

        }).catch((err) => {
            console.log(err);
        })

        //Save User data in chrome.storage
        await response.json().then((res) => {

          // console.log(res);

            //Store UserInfo in chrome local storage
            chrome.storage.local.set({ userInfo: res }, () => {

                console.log("UserInfo Stored");


            })

        })

    }

    return true;
})

