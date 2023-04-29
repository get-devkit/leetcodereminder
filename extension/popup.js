main() // calling main function


async function main(){

    
    //Check whether we have info for Leetcode profile    
    if( !(haveUserInfo()) ) handleLoginComponent()

}



//Returns true if we have user info otherwise false
function haveUserInfo(){

    return false

}


//Returns HTML Component for prompting user to open leetcode profile page
function handleLoginComponent (){

    let comp = document.createElement('p')
    comp.innerHTML = "Please open your leetcode profile !! &#10024;"

    document.body.innerHTML =  comp.outerHTML

}