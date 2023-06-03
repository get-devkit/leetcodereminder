
//*----------------------------- Variables ------------------------------------ *//


showReminder()

//* Logic to redirect to random que
async function goToRandomQue() {


    const randomQueTitle = await fetch(`${serverProxy}/randomEasyQue`).catch(() => { alert('Error Occured During Redirecting') })
    const res = await randomQueTitle.json()

    randomQue = `https://leetcode.com/problems/${res}/`

    window.open(randomQue)


}

//Function Injects HTML to show reminder
async function showReminder() {


    //Show the hidden Component
    const leetcodeBox = document.getElementById('leetcodeBox')
    leetcodeBox.style.transform = "translateX(0%)"
    leetcodeBox.style.display = "block"

    arr = [ 'Where you at ?' , 'Come on' , 'Let`s go' , 'What about Streaks ?' , 'Come on Vro we got a problem to solve' , 'Don`t forget to solve today' , 'Reminder !!!' , 'where is your determination vro ?' ]

    let text =  encodeURIComponent (arr[ (Math.floor( Math.random () * 10000 ) % 10)%(arr.length) ])
    
    //Fecthing cat images
    let dum = await fetch(`https://cataas.com/cat?type=sq&json=true`)
    dum = await dum.json()




    cat = `https://cataas.com/${(dum.url).split('?')[0]}/says/${text}?${(dum.url).split('?')[1]}`

    //Assigning Cat Images to bg
    const imgDiv = document.getElementById('catImgDiv')
    imgDiv.textContent = null
    imgDiv.style.backgroundImage = `url(${cat})`



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


