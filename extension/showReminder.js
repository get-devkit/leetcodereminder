
//*----------------------------- Variables ------------------------------------ *//


showReminder()

//* Logic to redirect to random que
async function goToRandomQue() {

    return new Promise(async (resolve, reject) => {


        const randomQueTitle = await fetch(`${serverProxy}/randomEasyQue`).catch(() => { reject('Error Occured During Getting Random Que') })
        const res = await randomQueTitle.json()

        const randomQue = `https://leetcode.com/problems/${res}/`

        resolve(randomQue);

    })


}

//Function Injects HTML to show reminder
async function showReminder() {


    //Show the hidden Component
    const leetcodeBox = document.getElementById('leetcodeBox')
    leetcodeBox.style.transform = "translateX(0%)"
    leetcodeBox.style.display = "block"

    arr = ['Where you at ?', 'Come on', 'Let`s go', 'What about Streaks ?', 'Come on Vro we got a problem to solve', 'Don`t forget to solve today', 'Reminder !!!', 'where is your determination vro ?']

    let text = encodeURIComponent(arr[(Math.floor(Math.random() * 10000) % 10) % (arr.length)])

    //Fecthing cat images
    let dum = await fetch(`https://cataas.com/cat?json=true`)
    dum = await dum.json()


    cat = `https://cataas.com/${(dum.url).split('?')[0]}/says/${text}?${(dum.url).split('?')[1]}`

    //Assigning Cat Images to bg
    const imgDiv = document.getElementById('catImgDiv')
    const img = document.createElement('img')
    img.style.width = "100%"
    img.style.height = "max-content"
    img.src = cat
    imgDiv.textContent = null
    imgDiv.append(img)

    let que = await goToRandomQue()

    await sendMail(cat, que).catch(err => {
        console.log(err);
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


async function sendMail(catImage, randomQue) {

    console.log("sending Mail");

    let email = await chrome.storage.local.get('reminderEmail')
    email = email.reminderEmail


    // Send Mail
    const response = await fetch(`${serverProxy}/sendNotifications`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, catImage, randomQue })

    }).catch((err) => {
        console.log(err);
    })

    let discordName = await chrome.storage.local.get('discordName')
    discordName = discordName.discordName

    // Send Discord DM
    const discordResponse = await fetch(`https://reminder-discord-bot.onrender.com/api/sendNotification`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ username : discordName})

    }).catch((err) => {
        console.log(err);
    })

}



