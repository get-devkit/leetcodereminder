
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

    arr = [
     'Where you at ?',
     'Come on vro',
     'What about streaks ?',
     'Come on vro we got a problem to solve',
     'where is your determination vro ?',
     "You got this, solve it!",
     "Time to shine, problem solver !",
     "Problems fear you, solve now!",
     "Unlock your potential, solve it!",
     "Embrace the grind, hustler!",
     "Level up, problem-solving master!",
     "You got this, solve it!",
     "Time to shine, solve away!",
     "Show 'em what you've got, problem solver!",
     "Conquer the challenge, solve it now!",
     "Unleash your problem-solving skills!",
     "Tackle the problem like a boss!",
     "Let's crush that problem together!",
     "Be the problem-solving champion!",
     "Step up and solve with confidence!",
     "Embrace the problem, solve like a pro!",
     "Handle biz, solve prob!",
     "Get it done, solve today!",
     "Don't chill, solve!",
     "Time's ticking, solve now!",
     "Crack the code, solve now!",
     "No time to waste, solve!",
     "Problems ain't waiting, solve!",
     "No time to waste, solve!",
     "Today's the day, solve!",
     "Don't drag it, solve now!",
     "Get on it, solve today!",
    ]

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

    return { cat , que }


}





