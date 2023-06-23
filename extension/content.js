
//*----------------------------- Variables ------------------------------------ *//

let body = document.querySelector("body");
const serverProxy = 'https://leetcodereminder.vercel.app/api'


//main function to create reminder
main()


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
        box.style.height = "50px"
        box.style.overflow = "hidden"
        box.style.marginTop = "0rem !important"
        box.style.backgroundColor = "rgba(32,32,32,0.5)"
        box.style.zIndex = "10000"
        box.style.position = "fixed"
        box.style.borderRadius = "8px"
        box.style.top = "10px"
        box.style.right = "10px"
        box.style.padding = "15px 20px"
        box.style.color = "#fff"
        box.style.fontSize = "20px"
        box.style.pointerEvents = "none"
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
        header.style.marginBottom = "1rem"

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
        dropIcon.style.width = "1rem"
        dropIcon.style.height = "1rem"
        dropIcon.style.cursor = "pointer"
        dropIcon.style.pointerEvents = "auto"
        dropIcon.onclick = () => {

            let box = document.getElementById('leetcodeBox')

            if (box.style.height !== 'fit-content')
                box.style.height = 'fit-content'
            else {
                box.style.height = '50px'

            }

        }

        notification.appendChild(title)
        notification.appendChild(dropIcon)


        //Creating close button
        const closeIcon = document.createElement('img')
        const closeIconSrc = await chrome.runtime.getURL("icons/x.svg")
        closeIcon.src = closeIconSrc
        closeIcon.alt = "close"
        closeIcon.style.width = "1rem"
        closeIcon.style.height = "50px"
        closeIcon.style.cursor = "pointer"
        closeIcon.style.pointerEvents = "auto"
        closeIcon.onclick = (()=>{
            hideReminder()
        })


        header.appendChild(notification)
        header.appendChild(closeIcon)


        //create div tag whom bg image will have cat image
        const imgDiv = document.createElement('div')
        imgDiv.id = 'catImgDiv'
        imgDiv.style.display = "flex"
        imgDiv.style.maxHeight = "60vh"
        imgDiv.style.justifyContent = "center"
        imgDiv.style.alignItems = "center"
        imgDiv.textContent = "Loading..."
        imgDiv.style.marginTop = "20px"
        imgDiv.style.overflow = 'hidden'


        //creating and styling randomQueBtn Button
        const randomQueBtn = document.createElement('button')
        randomQueBtn.innerHTML = "Solve Random Easy Que &#127919;"
        randomQueBtn.style.textAlign = "center"
        randomQueBtn.style.padding = "16px"
        randomQueBtn.style.width = "100%"
        randomQueBtn.style.backgroundColor = "rgb(255, 192, 30 , 0.7)"
        randomQueBtn.style.color = "#fff"
        randomQueBtn.style.marginTop = "10px"
        randomQueBtn.style.border = "none"
        randomQueBtn.style.borderRadius = "6px"
        randomQueBtn.style.outline = "none"
        randomQueBtn.style.fontSize = "1.2rem"
        randomQueBtn.style.fontWeight = "600"
        randomQueBtn.style.cursor = "pointer"
        randomQueBtn.style.pointerEvents = 'auto'
        randomQueBtn.onclick = () => {
            goToRandomQue()
        }

        // Append HTML to Body
        box.appendChild(header)
        box.appendChild(imgDiv)
        box.appendChild(randomQueBtn)
        body.appendChild(box)


    }

}

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

//Function to hide the reminder
async function hideReminder() {

    const leetcodeBox = document.getElementById('leetcodeBox')
    leetcodeBox.style.transform = "translateX(120%)"

    setTimeout(() => {

        () => {
            leetcodeBox.style.display = "none"
        }

    }, 1200);


}


