
//Checking Whether the Tab is Leetcode Profile and if yes then send the message to get the username
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {

    chrome.tabs.get(tabId).then((result) => {

        // console.log(result);

        //if the the webpage is leetcode profile page and loading is complete
        if (result.url === "https://leetcode.com/profile/" && result.status === 'complete') {


            //Send Message that page is loded
            chrome.tabs.sendMessage(result.id, { loaded: true }, (response) => {
                // console.log(response);
                chrome.runtime.reload()
            })

        }

    }).catch((err) => {
        console.log(err);
    });

});

