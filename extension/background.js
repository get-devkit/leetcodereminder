const proxy = 'http://localhost:3000/api'




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

        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        var raw = JSON.stringify({
            "username": "bhaveshanandpara12"
        });

        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
        };

        fetch("http://localhost:3000/api/getUserDetails", requestOptions)
            .then(response => response.text())
            .then(result => console.log(result))
            .catch(error => console.log('error', error));

    }

    return true;
})




