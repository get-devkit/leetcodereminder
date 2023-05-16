//----------------------------- Variables ------------------------------------ //

const serverProxy = 'https://leetcodereminder.vercel.app/api'
const totalEasy = 639
const totalMedium = 1390
const totalHard = 583


main() // calling main function


async function main() {


    //Check whether we have info for Leetcode profile
    let haveInfo = await haveUserInfo();


    if (!haveInfo) loginPrompt()
    else showPopup()

}


//----------------------------- Utilities function ------------------------------------ //

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
async function getTodayStatus(calendar) {

    return new Promise((resolve, reject) => {

        try {


            calendar = JSON.parse(calendar)

            const today = new Date().getTime()

            if (calendar["" + today] === undefined) {
                resolve("Unsolved")
            }
            else {
                resolve("Solved")
            }

        } catch (e) {
            reject(e)
        }

    })

}


//----------------------------- HTML Snippets -------------------------------------//

//Returns HTML Component for prompting user to open leetcode profile page
function loginPrompt() {


    let comp = document.createElement('p')

    comp.innerHTML = "Click on <a class='link' target='_blank' href='https://leetcode.com/profile/'>Leetcode Profile</a> to Login"

    document.body.innerHTML = comp.outerHTML

}


async function showPopup() {


    let userInfo = await chrome.storage.local.get('userInfo')
    userInfo = userInfo.userInfo

    // console.log(userInfo.submissionCalendar);

    // ----------------------------- Leetcode Profile --------------------------


    document.getElementById('profileImg').src = userInfo.profile.userAvatar
    document.getElementById('username').textContent = userInfo.username
    document.getElementById('rank').innerHTML = `Rank : ${userInfo.profile.ranking} `


    // ----------------------------- Leetcode Stats --------------------------

    document.getElementById('easyLabel').textContent = `Easy ${userInfo.submitStats.acSubmissionNum[1].count} / ${totalEasy}`
    document.getElementById('easyProg').value = userInfo.submitStats.acSubmissionNum[1].count
    document.getElementById('easyProg').max = totalEasy

    document.getElementById('mediumLabel').textContent = `Medium ${userInfo.submitStats.acSubmissionNum[2].count} / ${totalMedium}`
    document.getElementById('mediumProg').value = userInfo.submitStats.acSubmissionNum[2].count
    document.getElementById('mediumProg').max = totalMedium

    document.getElementById('hardLabel').textContent = `Hard ${userInfo.submitStats.acSubmissionNum[3].count} / ${totalHard}`
    document.getElementById('hardProg').value = userInfo.submitStats.acSubmissionNum[3].count
    document.getElementById('hardProg').max = totalHard

    percent = 75
    document.getElementById('fill').setAttribute('style', 'stroke-dashoffset: ' + ((100 - percent) / 100) * (-219.99078369140625));
    document.getElementById('value').innerHTML = percent + '%';

    // ----------------------------- Leetcode Status --------------------------

    await getTodayStatus(userInfo.submissionCalendar).then((result) => {

        let comp = document.getElementById('status')
        comp.textContent = result
        comp.classList.add(result)

    }).catch((err) => {
        console.log(err);
    })




}
