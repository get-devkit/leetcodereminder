const {getRandomQue} = require('./que')


let Subject = [
    "Coding Challenge Reminder: Test your skills! 🔥",
    "Time to Code: Don't Forget the Problem ⏲️",
    "Coding Puzzle Reminder: Crack it! 🚀",
    "Attention Coders: Solve the Challenge Now 👍",
    "Don't Miss Out: Coding Problem Awaits ⏰",
    "Reminder: Dive into the Coding Challenge 🌊",
    "Coding Task Reminder: Show your expertise 💻",
    "Urgent: Solve the Coding Problem ASAP 🏃‍♂️",
    "Challenge Alert: Tackle the Coding Problem 💪",
    "Reminder: Code your way to success 🛣️",
    "Attention Developers: Solve the Coding Puzzle 🧩",
    "Don't Procrastinate: Solve the Coding Problem 🥲",
    "Coding Enthusiasts: Don't Forget the Challenge ⚔️"
]

let Body = [
    "Embrace challenges as opportunities and let your problem-solving skills shine. ✨ ",
    "You're a problem-solving rockstar 🎸, so go out there and conquer those hurdles! ",
    "Problems are stepping stones to success—tackle them with determination and watch yourself grow. 💎",
    "No problem is too big when you approach it with creativity, resilience, and a can-do attitude. 😉",
    "Believe in your problem-solving prowess and let it propel you towards achieving your goals. 💪",
    "The thrill of overcoming challenges awaits you—get out there and solve those problems like a champ! 🏆",
    "Don't let problems intimidate you; use them as fuel to ignite your problem-solving genius. 🔥",
    "In the face of problems, remember: you're stronger 💪 than you think. Keep pushing, keep solving. ",
    "Every problem solved is a stepping stone towards unlocking your full potential. 🧠",
    "Embrace the adventure of problem-solving; it's where you discover your true strength and resilience. 🤠",
    "Problems are temporary roadblocks on the path to success. Keep going, keep solving, and keep progressing. 📈",
    "You have the power 💪 to turn problems into opportunities for growth and self-improvement.",
    "When faced with a problem, channel your inner problem-solving ninja 🥷 and unleash your skills. <i>DATTEBAYO</i> ",
    "Problems may try to knock you down, but you have the resilience to rise above and conquer them. ☀️ ",
    "You're a problem-solving superhero 🦹‍♂️ embrace challenges, wear your cape, and save the day!"
]



const discordMessage = () => {

    let sub = Subject[(Math.floor(Math.random() * 10000) % 10) % (Subject.length)]
    let body = Body[(Math.floor(Math.random() * 10000) % 10) % (Body.length)]

    return ` Leetcode Reminder ⏰\n \n ${sub} \n \n ${body} \n \n You've got this! 💫 `

}

const emailMsg = async() => {

    let que = await getRandomQue()
    
    let sub = Subject[(Math.floor(Math.random() * 10000) % 10) % (Subject.length)]
    let body = Body[(Math.floor(Math.random() * 10000) % 10) % (Body.length)]


    return {
        sub, body: `
    <h3>Leetcode Reminder ⏰ </h3>
    <p> ${body} </p>
    <p><i> <b>You've got this! 💫</b> </i></p>
    </br>
    <button style=" font-size:10px; padding:8px 12px; background-color : #FFC01E; border : none; border-radius : 4px "> <a style="color:white;" href="https://leetcode.com/problems/${que}/"> Random Que </a> </button>
    `}
}



module.exports = { discordMessage, emailMsg }
