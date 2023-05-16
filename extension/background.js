const serverProxy = 'https://leetcodereminder.vercel.app/api'


//Checking Whether the Tab is Leetcode Profile and if yes then send the message to get the username
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {

    chrome.tabs.get(tabId).then((result) => {

        // console.log(result);

        //if the the webpage is leetcode profile page and loading is complete
        if (result.url === "https://leetcode.com/profile/" && result.status === 'complete') {

            //Send Message that page is loded
            chrome.tabs.sendMessage(result.id, { loaded: true })
        }

    }).catch((err) => {
        console.log(err);
    });

});


// Recieve Message that page is loaded
chrome.runtime.onMessage.addListener(async (req, sender, sendResponse) => {

    if (req.userInfo) {

        //Calling API to getUserInfo

        console.log(JSON.stringify({ username: req.username }));

        // Get User Details
        const response = await fetch(`${serverProxy}/getUserDetails`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ username: req.username })
        }).catch((err)=>{
            console.log(err);
        })

        //Save User data in chrome.storage
        await response.json().then((res) => {

            console.log(res);

            chrome.storage.local.set({ userInfo: res }, () => {
                console.log("UserInfo Stored");
            })

        })

    }

    return true;
})

