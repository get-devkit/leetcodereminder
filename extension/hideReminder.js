hideReminder();

//Function to hide the reminder
async function hideReminder() {
  const leetcodeBox = document.getElementById("leetcodeBox");
  leetcodeBox.style.transform = "translateX(120%)";
  randomQueBtn.style.display = "none";

  setTimeout(() => {
    () => {
      leetcodeBox.style.display = "none";
    };
  }, 1200);
}
