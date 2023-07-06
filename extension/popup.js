//*----------------------------- Variables ------------------------------------ *//

const serverProxy = 'https://leetcodereminder.vercel.app/api'
const totalEasy = 639
const totalMedium = 1390
const totalHard = 583

// calling main function
main()

async function main() {


    //Check whether we have info for Leetcode profile
    let haveInfo = await haveUserInfo();


    if (!haveInfo) loginPrompt()
    else showPopup()

}


//*----------------------------- Utilities function ------------------------------------ *//


//Returns true if we have user info otherwise false
function haveUserInfo() {

    return new Promise(async (resolve, reject) => {

        try {

            //Check if we have userInfo in chrome storage
            let userInfo = await chrome.storage.local.get('userInfo')

            if (userInfo.userInfo === undefined || userInfo.userInfo === "User Not Found") resolve(false);

            else resolve(true)

        } catch (err) {

            reject(err)

        }

    })

}

//Returns status for the current day whether the user has solved today or not
async function getTodayStatus(res) {

    return new Promise(async (resolve, reject) => {

        try {

            const calendar = JSON.parse(res.submissionCalendar)

            //In Provided API the days are stored in timestamp format at the begging of day
            let today = new Date()
            today.setUTCHours(0, 0, 0, 0) // Set for the Today at 00:00:00
            today = today.getTime() / 1000 // get Timestamp 



            if (calendar["" + today] === undefined) {
                await chrome.storage.local.set({'todayStatus' : false})
                resolve("Unsolved")
            }
            else {
                await chrome.storage.local.set({'todayStatus' : true})
                resolve("Solved")
            }


        } catch (e) {
            reject(e)
        }

    })

}


//*----------------------------- HTML Snippets -------------------------------------*//


//Returns HTML Component for prompting user to open leetcode profile page
function loginPrompt() {


    let comp = document.createElement('p')

    comp.innerHTML = "Click on <a class='link' target='_blank' href='https://leetcode.com/profile/'>Leetcode Profile</a> to Login &#10024;"


    document.body.innerHTML = comp.outerHTML

}

//Returns HTML Component showing popup
async function showPopup() {

    // Get Username
    let username = await chrome.storage.local.get('username')
    username = username.username


    //Get UserInfo from chrome local Storage ( not Updated )
    let userInfo = await chrome.storage.local.get('userInfo')
    userInfo = userInfo.userInfo

    // console.log(userInfo); 

    //*Load Static Information first ( Not Real Time Information ) e.g --> Profil Image

    //* ----------------------------- Leetcode Profile -------------------------- *//

    document.getElementById('profileImg').src = userInfo.profile.userAvatar
    document.getElementById('username').textContent = userInfo.username
    document.getElementById('rank').innerHTML = `Rank : ${userInfo.profile.ranking} `

    //* API CALL *//

    // Get Real Time User Details
    const response = await fetch(`${serverProxy}/getUserDetails`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ username })
    }).catch((err) => {
        console.log(err);
    })

    //Using Result
    await response.json().then( async(res) => {
        userInfo = res
    })

    //* Load Dynamic Information ( Real Time Information ) e.g --> Today's Status *//

    //* ----------------------------- Header -------------------------- *//

    document.getElementById('logout').addEventListener('click', () => {
        chrome.storage.local.clear()
        chrome.runtime.reload()
    })


    //* ----------------------------- Leetcode Stats -------------------------- *//

    document.getElementById('easyLabel').textContent = `Easy ${userInfo.submitStats.acSubmissionNum[1].count} / ${totalEasy}`
    document.getElementById('easyProg').value = userInfo.submitStats.acSubmissionNum[1].count
    document.getElementById('easyProg').max = totalEasy

    document.getElementById('mediumLabel').textContent = `Medium ${userInfo.submitStats.acSubmissionNum[2].count} / ${totalMedium}`
    document.getElementById('mediumProg').value = userInfo.submitStats.acSubmissionNum[2].count
    document.getElementById('mediumProg').max = totalMedium

    document.getElementById('hardLabel').textContent = `Hard ${userInfo.submitStats.acSubmissionNum[3].count} / ${totalHard}`
    document.getElementById('hardProg').value = userInfo.submitStats.acSubmissionNum[3].count
    document.getElementById('hardProg').max = totalHard

    totalSubs = (userInfo.submitStats.acSubmissionNum[0].count / (totalEasy + totalHard + totalMedium) * 100).toFixed(2)
    document.getElementById('fill').setAttribute('style', 'stroke-dashoffset: ' + ((100 - totalSubs) / 100) * (-219.99078369140625));
    document.getElementById('value').innerHTML = totalSubs + " % ";

    //* ----------------------------- Leetcode Status -------------------------- *//

    await getTodayStatus(userInfo).then((result) => {

        let comp = document.getElementById('status')
        comp.textContent = result
        comp.classList.add(result)

    }).catch((err) => {
        console.log(err);
    })

    //* ----------------------------- Reminder Info -------------------------- *//


    let email = await chrome.storage.local.get('reminderEmail')
    email.reminderEmail === undefined ? "" : document.getElementById('email').value = email.reminderEmail

    let discordName = await chrome.storage.local.get('discordName')
    discordName.discordName === undefined ? "" : document.getElementById('discordName').value = discordName.discordName

    let time = await chrome.storage.local.get('reminderTime')
    time.reminderTime === undefined ? "" : document.getElementById('time').value = time.reminderTime

    let interval = await chrome.storage.local.get('reminderInterval')
    interval.reminderInterval === undefined ? "" : document.getElementById('interval').value = interval.reminderInterval

    //* Event Listeners to update the Reminder's Info *//

    document.getElementById('email').addEventListener('change', async (e) => {

        console.log(e.target.value);

        await chrome.storage.local.set({ 'reminderEmail': e.target.value }).catch((err) => {
            console.log(err);
            alert('Not able to set email')
        })

    })

    document.getElementById('discordName').addEventListener('change', async (e) => {

        console.log(e.target.value);

        await chrome.storage.local.set({ 'discordName': e.target.value }).catch((err) => {
            console.log(err);
            alert('Not able to set discord Name')
        })

    })

    document.getElementById('time').addEventListener('change', async (e) => {

        console.log(e.target.value);
        await chrome.storage.local.set({ 'reminderTime': e.target.value }).catch((err) => {
            console.log(err);
            alert('Not able to set email')
        })

    })

    document.getElementById('interval').addEventListener('change', async (e) => {

        console.log(e.target.value);

        let interval = e.target.value
        interval = interval < 3 ? 3 : interval


        await chrome.storage.local.set({ 'reminderInterval': interval }).catch((err) => {
            console.log(err);
            alert('Not able to set email')
        })

    })



}
