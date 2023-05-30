//*----------------------------- Variables ------------------------------------ *//

const serverProxy = 'https://leetcodereminder.vercel.app/api'
var popup = false;
var intialInterval = 30 * 1000 // 60 secs



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


//Checking if Time is Right
chrome.tabs.onActivated.addListener(function (activeInfo) {

    //For Activate Tabs
    chrome.tabs.get(activeInfo.tabId).then(async (result) => {

        //* SetInterval function to check time for every 5 sec

        setInterval(async () => {

            console.log(intialInterval);

            // console.log("checking Time");

            let userInfo = await chrome.storage.local.get('userInfo')
            userInfo = userInfo.userInfo

            if (userInfo != undefined) {
                //* check whether we should display reminder container
                handleReminder(activeInfo.tabId)
            }

        }, intialInterval );



    }).catch((err) => {

    });


});

async function handleReminder(tabId) {


    let time = await chrome.storage.local.get('reminderTime')
    time = time.reminderTime

    let hr = parseInt(time.split(':')[0])
    let min = parseInt(time.split(':')[1])

    //Convert user set time into minutes
    time = hr * 60 + min

    //Converting Current Time in minutes
    let now = new Date()
    now = now.getHours() * 60 + now.getMinutes()


    //If It's past the set time
    if (now >= time) {

        let interval = await chrome.storage.local.get('reminderInterval')
        interval = interval.reminderInterval

        //! For testing purpose only set it to 3 min ( otherwise 30 min )
        if (interval === undefined) interval = 3

        console.log("time remaining = " + ( interval - (now % time) % interval ) );
        
        console.log(interval);

        //Only if it's time to show reminder
        if ((now % time) % interval == 0 && !popup) {

            popup = true

            console.log("sending msg to show the container");

            //* Sending the msg to content-scripts that show the reminder container
            chrome.tabs.sendMessage(tabId, { showReminder: true })

        }

        // If It's 1 minute past reminder
        else if ((now % time) % interval == 1 && popup) {

            popup = false
            intialInterval = (interval) * 60 * 1000

            console.log("Sending Msg to hide the container");

            //* Sending the msg to content-scripts that show the reminder container
            chrome.tabs.sendMessage(tabId, { showReminder: false })

        }


    }

}