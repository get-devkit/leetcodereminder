//*----------------------------- Variables ------------------------------------ *//

const serverProxy = 'https://leetcodereminder.vercel.app/api'
var popupInfo = {};
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
        await response.json().then(async (res) => {

            //Store UserInfo in chrome local storage
            await chrome.storage.local.set({ userInfo: res }, () => {

                console.log("UserInfo Stored");

            })


        }).catch((err) => {

            console.log(err);

        })

    }

    return true;
})


//Checking if Time is Right

chrome.tabs.onActivated.addListener(async function (activeInfo) {



    let todayStatus = await chrome.storage.local.get('todayStatus')

    if (todayStatus.todayStatus) return;


    //* show the reminder container
    chrome.scripting.executeScript({
        target: { tabId: activeInfo.tabId },
        files: ['content.js']
    });

    //* show the reminder container

    chrome.scripting.executeScript({
        target: { tabId: activeInfo.tabId },
        files: ['content.js']
    });

    //* show the reminder container

    chrome.scripting.executeScript({
        target: { tabId: activeInfo.tabId },
        files: ['content.js']
    });


    //For Activate Tabs
    chrome.tabs.get(activeInfo.tabId).then(async (result) => {

        //for that specific tab
        popupInfo[activeInfo.tabId + ""] = false

        //* SetInterval function to check time for every 5 sec

        setInterval(async () => {

            //! for debugging
            console.log(intialInterval + " " + activeInfo.tabId + " " + popupInfo[activeInfo.tabId]);

            let userInfo = await chrome.storage.local.get('userInfo')
            userInfo = userInfo.userInfo

            if (userInfo != undefined) {
                //* check whether we should display reminder container
                handleReminder(activeInfo.tabId)
            }

        }, intialInterval);



    }).catch((err) => {
        console.log(err);
    });


});


//Function to check time for reminder and send necessary messages
async function handleReminder(tabId) {

    try {

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

            console.log("time remaining = " + (interval - (now % time) % interval));

            //Only if it's time to show reminder
            // popupInfo[tabId+""] to check for specific tabs
            if ((now % time) % interval == 0 && !popupInfo[tabId + ""]) {

                console.log("sending msg to show the container");

                //* show the reminder container
                
                popupInfo[tabId + ""] = true
                intialInterval = 30 * 1000


                chrome.scripting.executeScript({
                    target: { tabId: tabId },
                    files: ['showReminder.js']
                });

            }

            // If It's 1 minute past reminder
            else if ((now % time) % interval != 0 && popupInfo[tabId + ""]) {

                intialInterval = (interval / 4) * 60 * 1000 //Checks for 4 times between interval

                console.log("Sending Msg to hide the container");

                popupInfo[tabId + ""] = false

                //* hide the reminder container
                chrome.scripting.executeScript({
                    target: { tabId: tabId },
                    files: ['hideReminder.js']
                });




            }

        }

    } catch (err) {

        console.log(err);

    }


}

