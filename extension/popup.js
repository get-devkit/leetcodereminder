//*----------------------------- Variables ------------------------------------ *//

serverProxy = "https://leetcodereminder-ten.vercel.app/api";
const totalEasy = 639;
const totalMedium = 1390;
const totalHard = 583;
let timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

// calling main function
main();

async function main() {
  //Check whether we have info for Leetcode profile
  let haveInfo = await haveUserInfo();

  if (!haveInfo) loginPrompt();
  else showPopup();
}

//*----------------------------- Utilities function ------------------------------------ *//

// Returns true if we have user info otherwise false
function haveUserInfo() {
  return new Promise(async (resolve, reject) => {
    try {
      //Check if we have userInfo in chrome storage
      let userInfo = await chrome.storage.local.get("userInfo");

      if (
        userInfo.userInfo === undefined ||
        userInfo.userInfo === "User Not Found"
      )
        resolve(false);
      else resolve(true);
    } catch (err) {
      reject(err);
    }
  });
}

//Returns status for the current day whether the user has solved today or not
async function getTodayStatus(res) {
  return new Promise(async (resolve, reject) => {
    try {
      const calendar = JSON.parse(res.submissionCalendar);

      //In Provided API the days are stored in timestamp format at the begging of day
      let today = new Date();
      today.setUTCHours(0, 0, 0, 0); // Set for the Today at 00:00:00
      today = today.getTime() / 1000; // get Timestamp

      if (calendar["" + today] === undefined) {
        await chrome.storage.local.set({ todayStatus: false });
        resolve("Unsolved");
      } else {
        await chrome.storage.local.set({ todayStatus: true });
        resolve("Solved");
      }
    } catch (e) {
      reject(e);
    }
  });
}

//*----------------------------- HTML Snippets -------------------------------------*//

//Returns HTML Component for prompting user to open leetcode profile page
function loginPrompt() {
  let comp = document.createElement("p");

  comp.innerHTML =
    "Click on <a class='link' target='_blank' href='https://leetcode.com/profile/'>Leetcode Profile</a> to Login &#10024;";

  document.body.innerHTML = comp.outerHTML;
}

//Returns HTML Component showing popup
async function showPopup() {
  
  // Get Username
  let username = await chrome.storage.local.get("username");
  username = username.username;

  //Get UserInfo from chrome local Storage ( not Updated )
  let userInfo = await chrome.storage.local.get("userInfo");
  userInfo = userInfo.userInfo;

  console.log(userInfo); //! debugging

  //*Load Static Information first ( Not Real Time Information ) e.g --> Profil Image

  //* ----------------------------- Leetcode Profile -------------------------- *//

  document.getElementById("profileImg").src = userInfo.profile.userAvatar;
  document.getElementById("username").textContent = userInfo.username;
  document.getElementById(
    "rank"
  ).innerHTML = `Rank : ${userInfo.profile.ranking} `;

  //* API CALL *//

  //* ----------------------------- Reminder Info -------------------------- *//

  //* For Status Dots *//

  var dataFromServer;

    // console.log(userInfo);


  // Get User Details from DB
  let userData = await fetch(
    `https://leetcodereminder-kcxt.onrender.com/userdata/getUserInfo?username=${username}`,
    {
      method: "POST",
      headers:{
        "Content-Type": "application/json",
      },
      body : JSON.stringify({
        "accessToken" : userInfo.accessToken
      })

    }
  ).catch((err) => {
    console.log(err);
  });

  if (userData.status != 200) dataFromServer = undefined;
  else {
    dataFromServer = await userData.json().catch((e) => {
      dataFromServer = undefined;
    });
  }
  // console.log(dataFromServer); //! debugging

  //udpate email input
  let email = await chrome.storage.local.get("reminderEmail");
  email.reminderEmail === undefined
    ? ""
    : (document.getElementById("email").value = email.reminderEmail);

  //update status dots
  if (
    dataFromServer !== undefined &&
    email.reminderEmail === dataFromServer.email
  ) {
    document.getElementById("emailStatus").style.backgroundColor = "#2CBB5D";
  } else {
    document.getElementById("emailStatus").style.backgroundColor =
      "rgba(187, 44, 44, 0.49)";
  }

  //udpate discordname input
  let discordName = await chrome.storage.local.get("discordName");
  discordName.discordName === undefined
    ? ""
    : (document.getElementById("discordName").value = discordName.discordName);

  //update status dots
  if (
    dataFromServer !== undefined &&
    discordName.discordName === dataFromServer.discordName
  ) {
    document.getElementById("discordNameStatus").style.backgroundColor =
      "#2CBB5D";
  } else {
    document.getElementById("discordNameStatus").style.backgroundColor =
      "rgba(187, 44, 44, 0.49)";
  }

  //udpate setTime input

  let time = await chrome.storage.local.get("reminderTime");
  time.reminderTime === undefined
    ? ""
    : (document.getElementById("time").value = time.reminderTime);

  //update status dots
  if (
    dataFromServer !== undefined &&
    time.reminderTime ===
      Math.floor(dataFromServer.setTime / 60).toLocaleString(undefined, {
        minimumIntegerDigits: 2,
      }) +
        ":" +
        (dataFromServer.setTime % 60).toLocaleString(undefined, {
          minimumIntegerDigits: 2,
        })
  ) {
    document.getElementById("setTimeStatus").style.backgroundColor = "#2CBB5D";
  } else {
    document.getElementById("setTimeStatus").style.backgroundColor =
      "rgba(187, 44, 44, 0.49)";
  }

  //udpate interval input
  let interval = await chrome.storage.local.get("reminderInterval");
  interval.reminderInterval === undefined
    ? ""
    : (document.getElementById("interval").value = interval.reminderInterval);

  //update status dots
  if (
    dataFromServer !== undefined &&
    interval.reminderInterval === parseInt(dataFromServer.interval)
  ) {
    document.getElementById("intervalStatus").style.backgroundColor = "#2CBB5D";
  } else {
    document.getElementById("intervalStatus").style.backgroundColor =
      "rgba(187, 44, 44, 0.49)";
  }

  // Get Real Time User Details
  const response = await fetch(`${serverProxy}/getUserDetails`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username }),
  }).catch((err) => {
    console.log(err);
  });

  //Using Result
  await response.json().then(async (res) => {
    userInfo = res; //will be used throughout the code
  });

  console.log(userInfo);

  //* ----------------------------- Header -------------------------- *//

  document.getElementById("logout").addEventListener("click", async () => {


    
    // delete User Details from DB
    let userData = await fetch(
      `https://leetcodereminder-kcxt.onrender.com/userdata/user?username=${username}`,
      
      {
        method: "DELETE",
        headers: {
          'Content-Type': 'application/json'
        },
        body : JSON.stringify({
          "accessToken" : userInfo.accessToken
        })
      }
    ).catch((err) => {
      console.log(err);
    });

    // chrome.storage.local.clear();

    // chrome.runtime.reload();
  });

  //* ----------------------------- Leetcode Stats -------------------------- *//

  document.getElementById(
    "easyLabel"
  ).textContent = `Easy ${userInfo.submitStats.acSubmissionNum[1].count} / ${totalEasy}`;
  document.getElementById("easyProg").value =
    userInfo.submitStats.acSubmissionNum[1].count;
  document.getElementById("easyProg").max = totalEasy;

  document.getElementById(
    "mediumLabel"
  ).textContent = `Medium ${userInfo.submitStats.acSubmissionNum[2].count} / ${totalMedium}`;
  document.getElementById("mediumProg").value =
    userInfo.submitStats.acSubmissionNum[2].count;
  document.getElementById("mediumProg").max = totalMedium;

  document.getElementById(
    "hardLabel"
  ).textContent = `Hard ${userInfo.submitStats.acSubmissionNum[3].count} / ${totalHard}`;
  document.getElementById("hardProg").value =
    userInfo.submitStats.acSubmissionNum[3].count;
  document.getElementById("hardProg").max = totalHard;

  totalSubs = (
    (userInfo.submitStats.acSubmissionNum[0].count /
      (totalEasy + totalHard + totalMedium)) *
    100
  ).toFixed(2);
  document
    .getElementById("fill")
    .setAttribute(
      "style",
      "stroke-dashoffset: " + ((100 - totalSubs) / 100) * -219.99078369140625
    );
  document.getElementById("value").innerHTML = totalSubs + " % ";

  //* ----------------------------- Leetcode Status -------------------------- *//

  //Show today's status on popup
  await getTodayStatus(userInfo)
    .then((result) => {
      let comp = document.getElementById("status");
      comp.textContent = result;
      comp.classList.add(result);
    })
    .catch((err) => {
      console.log(err);
    });

  //* Event Listeners to update the Reminder's Info *//

  document.getElementById("email").addEventListener("change", async (e) => {
    // console.log(e.target.value); //! debugging

    await chrome.storage.local
      .set({ reminderEmail: e.target.value })
      .catch((err) => {
        console.log(err);
      });

    await updateDataInDB(userInfo);
  });

  document
    .getElementById("discordName")
    .addEventListener("change", async (e) => {
      // console.log(e.target.value); //! debugging

      await chrome.storage.local
        .set({ discordName: e.target.value })
        .catch((err) => {
          console.log(err);
        });

      await updateDataInDB(userInfo);
    });

  document.getElementById("time").addEventListener("change", async (e) => {
    console.log(e.target.value);
    await chrome.storage.local
      .set({ reminderTime: e.target.value })
      .catch((err) => {
        console.log(err);
      });

    await updateDataInDB(userInfo);
  });

  document.getElementById("interval").addEventListener("change", async (e) => {
    // console.log(e.target.value);

    let interval = e.target.value;
    interval = interval < 30 ? 30 : interval;

    await chrome.storage.local
      .set({ reminderInterval: parseInt(interval) })
      .catch((err) => {
        console.log(err);
      });

    await updateDataInDB(userInfo);
  });
}

async function updateDataInDB(userInfo) {

  return new Promise(async (resolve, reject) => {
    let d = new Date();

    let setTime = await chrome.storage.local.get("reminderTime");
    setTime =
      parseInt(setTime.reminderTime.split(":")[0]) * 60 +
      parseInt(setTime.reminderTime.split(":")[1]);

    let tzOffset = d.getTimezoneOffset();
    let reminderEmail = await chrome.storage.local.get("reminderEmail");
    let discordName = await chrome.storage.local.get("discordName");
    let reminderInterval = await chrome.storage.local.get("reminderInterval");
    let status = await getTodayStatus(userInfo);

    if (status === "Solved") status = true;
    else status = false;

    let data = JSON.stringify({
      username: userInfo.username,
      accessToken: userInfo.accessToken,
      status: status,
      tzOffset: tzOffset,
      timezone: timezone,
      email: reminderEmail.reminderEmail,
      discordName: discordName.discordName,
      setTime: setTime,
      interval: parseInt(reminderInterval.reminderInterval),
    });

    // update User Details from DB
    const response = await fetch(
      // `https://leetcodereminder-kcxt.onrender.com/userdata/userInfo`,
      `http://localhost:10000/userdata/userInfo`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: data,
      }
    )
      .then((result) => {
        resolve(result);
      })
      .catch((err) => {
        console.log(err);
        reject(err);
      });
  });
}
