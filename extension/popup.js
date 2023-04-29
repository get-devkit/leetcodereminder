main() // calling main function


async function main(){

    
    //Check whether we have info for Leetcode profile
    let haveInfo = await haveUserInfo();

    showPopup()

    // if( !haveInfo ) loginPrompt()
    // else showPopup()

}



//----------------------------- Utilities function ------------------------------------ //

//Returns true if we have user info otherwise false
function haveUserInfo(){

    return new Promise( async (resolve , reject )=>{
  
        try{

            //Check if we have userInfo in chrome storage
            let userInfo = await chrome.storage.local.get('userInfo')
            
            if( userInfo.userInfo === undefined ) resolve(false) ;
            else  resolve(true)

        }catch(err) {

            reject(err)

        }
        
    })

}

//----------------------------- HTML Snippets -------------------------------------//

//Returns HTML Component for prompting user to open leetcode profile page
function loginPrompt(){


    let comp = document.createElement('p')
    comp.innerHTML = "Please open your leetcode profile !! &#10024;"

    document.body.innerHTML =  comp.outerHTML

}

async function showPopup(){

    

}