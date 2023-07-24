//*----------------------------- Variables ------------------------------------ *//

var serverProxy = 'https://leetcodereminder.vercel.app/api'
var TabsInfo = new Set(); //to save the tabs id
var isPopupVisible = false; //to check whether the reminder is currently visible or not
var intialInterval = 30 * 1000 // 45 secs
var reminderData


//After the extension is installed once it should redirect to about page

chrome.runtime.onInstalled.addListener(function (object) {

    let externalUrl = "https://leetcodereminder.vercel.app/about";

    if (object.reason === chrome.runtime.OnInstalledReason.INSTALL) {
        chrome.tabs.create({ url: externalUrl }, function (tab) {
            console.log("https://leetcodereminder.vercel.app/");
        });
    }
});


//Checking Whether the Tab is Leetcode Profile and if yes then send the message to get the username else add tab id to TabsInfo

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {

    chrome.tabs.get(tabId).then(async (result) => {

        //if the the webpage is leetcode profile page and loading is complete
        if (result.url === "https://leetcode.com/profile/" && result.status === 'complete') {

            //Send Message to content script that page is loded
            chrome.tabs.sendMessage(result.id, { loaded: true })

        } else {

            //Inject The Reminder Box in all open tabs

            //Push tab's id
            TabsInfo.add(result.id)
            console.log(TabsInfo);

            //* load the reminder container
            chrome.scripting.executeScript({
                target: { tabId: result.id },
                files: ['content.js']
            });

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

    //Execute hideReminder.js for all tabs
    if (req.hideReminder) {

        console.log("Hiding all the reminders");

        //For all tabs
        TabsInfo.forEach(tabId => {

            console.log("Sending Msg to hide container at " + tabId);

            //* hide the reminder container
            chrome.scripting.executeScript({
                target: { tabId: tabId },
                files: ['hideReminder.js']
            })

            intialInterval = 60 * 1000


        })

        isPopupVisible = false;


    }

    return true;
})



//Checking if Time is Right to show the reminder
chrome.tabs.onActivated.addListener(async function (activeInfo) {

    let todayStatus = await chrome.storage.local.get('todayStatus')

    // if (todayStatus.todayStatus) return; //! only for debugging purpose it is commented

    //For Active Tabs
    chrome.tabs.get(activeInfo.tabId).then(async (tabInfo) => {

        //* SetInterval function to check time at intial interval
        setInterval(async () => {

            let userInfo = await chrome.storage.local.get('userInfo')
            userInfo = userInfo.userInfo

            if (userInfo != undefined) {

                //* check whether we should display reminder container
                handleReminder(tabInfo.id)

            }

        }, intialInterval);


    }).catch((err) => {
        console.log(err);
    });


});


//Function to check time for reminder and send necessary messages
async function handleReminder(tabId) {

    try {

        //get user specified reminderTime
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

            console.log("time remaining = " + (now % time) % interval);

            //Show reminder
            if ((now % time) % interval == 0 && !isPopupVisible) {

                //Intial Interval changed to
                intialInterval = 60 * 1000

                //Show Container for every tab available
                TabsInfo.forEach(async (tabId) => {

                    console.log("Sending Msg to show container at " + tabId);

                    //* show the reminder container
                    chrome.scripting.executeScript({
                        target: { tabId: tabId },
                        files: ['showReminder.js']
                    })

                })


                isPopupVisible = true



            }

            // If It's 1 minute past showing reminder, hide it
            else if ((now % time) % interval != 0 && isPopupVisible) {

                intialInterval = ((interval * 60) / 4) * 1000 //Checks for 4 times between interval

                //Hide Container for every tab available
                TabsInfo.forEach((tabId) => {

                    console.log("Sending Msg to hide container at " + tabId);


                    //* hide the reminder container
                    chrome.scripting.executeScript({
                        target: { tabId: parseInt(tabId) },
                        files: ['hideReminder.js']
                    });

                })

                isPopupVisible = false;


            }

        }

    } catch (err) {

        console.log(err);

    }


}

