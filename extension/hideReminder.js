

hideReminder()

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

