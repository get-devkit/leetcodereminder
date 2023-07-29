
//*----------------------------- Variables ------------------------------------ *//


let body = document.querySelector("body");
serverProxy = 'https://leetcodereminder.vercel.app/api'


//* main function to create reminder
main()


//* Recieve Message 
chrome.runtime.onMessage.addListener(async (req, sender, sendResponse) => {

    //Checks if Page is loaded or not
    if (req.loaded) {

        await getUsername().then(async (result) => {

            //Save username in chrome's localstoarge
            await chrome.storage.local.set({ username: result.username }, () => {
                // console.log("Username Stored");//! debugging
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


//Main Function 

async function main() {

    // `document.querySelector` may return null if the selector doesn't match anything.
    if (body) {

        //Creating Container
        const box = document.createElement('div')
        box.className = "leetcodeBox"
        box.id = "leetcodeBox"

        //Styling Container
        box.style.display = "block"
        box.style.width = "500px"
        box.style.maxHeight = "65px !important"

        box.style.overflow = "hidden"
        box.style.marginTop = "0px !important"
        box.style.backgroundColor = "rgba(32,32,32,0.5)"
        box.style.zIndex = "10000"
        box.style.position = "fixed"
        box.style.borderRadius = "8px"
        box.style.top = "10px"
        box.style.right = "10px"
        box.style.padding = "20px 20px"
        box.style.color = "#fff"
        box.style.fontSize = "20px"
        box.style.fontFamily = "poppins"
        // box.style.pointerEvents = "none"
        box.style.transform = "translate(120%)"
        box.style.transition = "transform 1.8s ease-out"
        box.style.backdropFilter = "blur(60px)"


        //Creating header
        const header = document.createElement('div')
        header.className = "header"
        header.style.display = "flex"
        header.style.alignItems = "center"
        header.style.justifyContent = "space-between"
        header.style.flexDirection = "row"

        //Creating header
        const notification = document.createElement('div')
        notification.className = "notification"
        notification.style.display = "flex"
        notification.style.alignItems = "center"
        notification.style.flexDirection = "row"

        //Creating Title
        const title = document.createElement('p')
        title.innerHTML = "&#10024; Leetcode Daily Reminder"
        title.style.margin = "0"
        title.style.fontSize = '20px'
        title.style.marginRight = "15px"


        //Creating dropdown
        const dropIcon = document.createElement('img')
        const IconSrc = await chrome.runtime.getURL("icons/chevron-down.svg")
        dropIcon.src = IconSrc
        dropIcon.alt = "icons"
        dropIcon.style.width = "24px"
        dropIcon.style.height = "24px"
        dropIcon.style.cursor = "pointer"
        dropIcon.style.pointerEvents = "auto"
        dropIcon.onclick = () => {

            let box = document.getElementById('leetcodeBox')

            box.style.maxHeight = 'max-content'


            if (imgDiv.style.display == 'flex') {


                imgDiv.style.display = 'none'
                randomQueBtn.style.display = 'none'


            } else {

                imgDiv.style.display = 'flex'
                randomQueBtn.style.display = 'block'
            }




        }

        notification.appendChild(title)
        notification.appendChild(dropIcon)


        //Creating close button
        const closeIcon = document.createElement('img')
        const closeIconSrc = await chrome.runtime.getURL("icons/x.svg")
        closeIcon.src = closeIconSrc
        closeIcon.alt = "close"
        closeIcon.style.width = "24px"
        closeIcon.style.height = "24px"
        closeIcon.style.cursor = "pointer"
        closeIcon.style.pointerEvents = "auto"
        closeIcon.onclick = (() => {
            hideReminder()
        })


        header.appendChild(notification)
        header.appendChild(closeIcon)


        //create div tag whom bg image will have cat image
        const imgDiv = document.createElement('div')
        imgDiv.id = 'catImgDiv'
        imgDiv.style.display = "none"
        imgDiv.style.maxHeight = "60vh"
        imgDiv.style.justifyContent = "center"
        imgDiv.style.alignItems = "center"
        imgDiv.textContent = "Loading..."
        imgDiv.style.marginTop = "20px"
        imgDiv.style.overflow = 'hidden'


        //creating and styling randomQueBtn Button
        const randomQueBtn = document.createElement('button')
        randomQueBtn.innerHTML = "Solve Random Easy Que &#127919;"
        randomQueBtn.id = "randomQueBtn"
        randomQueBtn.style.display = "none"
        randomQueBtn.style.textAlign = "center"
        randomQueBtn.style.padding = "16px"
        randomQueBtn.style.width = "100%"
        randomQueBtn.style.backgroundColor = "rgb(255, 192, 30 , 0.7)"
        randomQueBtn.style.color = "#fff"
        randomQueBtn.style.marginTop = "10px"
        randomQueBtn.style.border = "none"
        randomQueBtn.style.borderRadius = "6px"
        randomQueBtn.style.outline = "none"
        randomQueBtn.style.fontSize = "16px"
        randomQueBtn.style.fontWeight = "600"
        randomQueBtn.style.cursor = "pointer"
        randomQueBtn.style.pointerEvents = 'auto'

        // Append HTML to Body
        box.appendChild(header)
        box.appendChild(imgDiv)
        box.appendChild(randomQueBtn)
        body.appendChild(box)


    }

}

// Function to return username from webpage
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

//Function to hide the reminder
async function hideReminder() {

    //Send Message to bg script to execute hideReminder for all tabs
    await chrome.runtime.sendMessage({ hideReminder: true });

}

