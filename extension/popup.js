main() // calling main function


async function main() {


    //Check whether we have info for Leetcode profile
    let haveInfo = await haveUserInfo();


    if( !haveInfo ) loginPrompt()
    else showPopup()

}



//----------------------------- Utilities function ------------------------------------ //

//Returns true if we have user info otherwise false
function haveUserInfo() {

    return new Promise(async (resolve, reject) => {

        try {

            //Check if we have userInfo in chrome storage
            let userInfo = await chrome.storage.local.get('userInfo')

            if (userInfo.userInfo === undefined) resolve(false);
            else resolve(true)

        } catch (err) {

            reject(err)

        }

    })

}

//----------------------------- HTML Snippets -------------------------------------//

//Returns HTML Component for prompting user to open leetcode profile page
function loginPrompt() {


    let comp = document.createElement('p')

    //Subtitle 1
    const sub1 = document.createElement('p')
    sub1.className = "subtitle"
    sub1.style.textAlign = "left"
    sub1.textContent = "Enter your leetcode username"

    //Input Box
    const input = document.createElement('input')
    input.className = "input"
    input.id = "usernameInput"
    input.style.margin = "16px 0 0 0"
    input.placeholder = "username"

    //Enter Button
    const btn = document.createElement('button')
    btn.className = "primaryBtn"
    btn.id = "enterButton"
    btn.textContent = "Enter"

    comp.append( sub1 , input , btn)
    document.body.innerHTML = comp.outerHTML

    document.getElementById('enterButton').addEventListener('click' , ()=>{

            console.log(document.getElementById('usernameInput').value);

    })

}

async function showPopup() {



}