import React from 'react'
import Image from 'next/image'

import Logo from '../public/Logo.svg'
import addtochrome from '../public/images/addtochrome.png'
import addExt from '../public/images/addExt.png'
import Ext from '../public/images/ext.png'
import Pin from '../public/images/pin.png'
import ExtIcon from '../public/images/extIcon.png'

import login from '../public/images/login.png'
import profile from '../public/images/profile.png'
import leetcodeProfile from '../public/images/leetcode-profile.png'
import status from '../public/images/status.png'
import settings from '../public/images/settings.png'
import reminder from '../public/images/reminder.png'
import expand from '../public/images/expand.png'

export default function About() {

    return (
        <>

            <section >

                {/* //Header */}
                <div className="header">

                    <div className="logo">

                        <Image src={Logo} fill alt='Logo' />
                    </div>


                    <h1>Leetcode Reminder</h1>

                </div>

                <div className="container">

                    <div className="intro ">

                        <h2 className="title">Introduction</h2>

                        <p className='text' > Hey, say hello to Leetcode Reminder – your coding sidekick! 🚀 This Chrome Extension is your secret weapon for keeping those Leetcode streaks going strong. </p>

                        <p className='text' >Show off your coding skills to your pals like a champ! 😉 And if you're a student or a working pro itching to jump into DSA or competitive programming but life keeps getting in the way, well, guess what? This extension is your new best buddy! 🚀</p>

                    </div>

                    <div className="install">

                        <h2 className="title">How to Install ??</h2>

                        <p className='text'> You can search for Leetcode Reminder on Chrome Webstore or visit here.
                            <br />
                            <br />
                            Then  click on Add to Chrome to add the extension. </p>

                        <div className="addtochromeImg">

                            <div className="addtochromeImgDiv">
                                <Image src={addtochrome} />
                            </div>

                        </div>

                        <p className='text'> A popup will appear which will tell you all the necessary actions the extension can perform, to continue you can click on Add Extension
                            <br />
                            <br />
                            And ta-da! The extension is officially part of your Chrome crew. 🚀 </p>

                        <div className="addExtImg">

                            <div className="addExtImgDiv">
                                <Image src={addExt} />
                            </div>

                        </div>

                        <p className='text'> After this if you wish to pin the extension then follow this instructions : </p>

                        <span className='text' > 1. Click on <img style={{ display: 'inline' }} src="/images/extension.svg" alt="extension icon" /> button to view all extensions</span>

                        <div className="ExtImg">

                            <div className="ExtImgDiv">
                                <Image src={Ext} />
                            </div>

                        </div>

                        <span className='text' > 2. You can find Leetcode Reminder on the list and click on  <img style={{ display: 'inline' }} src="/images/pin.svg" alt="extension icon" /> Icon</span>

                        <div className="PinImg">

                            <div className="PinImgDiv">
                                <Image src={Pin} />
                            </div>

                        </div>

                        <span className='text' > 3. Now the Leetcode Reminder Icon will appear on tab</span>

                        <div className="ExtIconImg">

                            <div className="ExtIconImgDiv">
                                <Image src={ExtIcon} />
                            </div>

                        </div>

                    </div>

                    <div className="howtouse">

                        <h2 className="title">How to Use ??</h2>

                        <div className="login howtouse-container ">

                            <h3 className="subtitle">1. LOGIN</h3>

                            <p className='text'> Ready to roll? Just tap that Leetcode Profile button, and it'll zip you over to your Leetcode profile page 😄 👍 Make sure you're logged in to your leetcode account and good to go! </p>

                            <div className="loginImg">

                                <div className="loginImgDiv">
                                    <Image src={login} />
                                </div>

                            </div>

                            <p className="text">Now, give that extension icon another click, and it's gonna show up like this  👀 : </p>

                            <div className="profileImg">

                                <div className="profileImgDiv">
                                    <Image src={profile} />
                                </div>

                            </div>

                            <div className="notice red text">

                                Hey, if you don't see it at first, no worries! Sometimes, you might need to give it a little nudge by clicking on it again.
                                <br />
                                <br />
                                But hey, if you've given it a few good tries and it's still being shy, no sweat. You can always try the classic tech fix: remove the extension and give it a fresh install. That usually does the trick! ⚠️🛠️

                            </div>

                        </div>

                        <div className="profile howtouse-container">

                            <h3 className="subtitle">2. PROFILE</h3>

                            <p className='text'> Here's your very own profile, showing off your Leetcode username and where you stand in the ranks. 😎</p>

                            <div className="leetcodeProfileImg">

                                <div className="leetcodeProfileImgDiv">
                                    <Image src={leetcodeProfile} />
                                </div>

                            </div>

                        </div>

                        <div className="status howtouse-container">

                            <h3 className="subtitle">3. TODAY'S STATUS</h3>

                            <p className='text'> It spills the beans on your daily status—whether you've cracked a problem today or not. No pesky notifications once you've tackled at least one challenge that day!  🎉</p>

                            <div className="statusImg">

                                <div className="statusImgDiv">
                                    <Image src={status} />
                                </div>

                            </div>

                        </div>

                        <div className="setting howtouse-container">

                            <h3 className="subtitle">4. CUSTOMIZE REMINDER SETTINGS</h3>

                            <p className='text'> You can customize when and where you want your notification
                                <br />
                                <br />
                                Add Email : Want reminders in your inbox? Just pop in your email.
                                <br />
                                <br />
                                Add Discord Username : Into Discord? Cool, add your Discord username and follow our quick steps to set it up <a href="#" className='link'>here</a> .
                                <br />
                                <br />
                                Set Time :  You call the shots on when you get reminders. Whether it's post-school or anytime, pick the hour that suits you (like 17:30).
                                <br />
                                <br />
                                Set Interval : Don't want to be bombarded? No worries, set how often you want those nudges. The shortest interval is every 30 minutes.</p>

                            <div className="settingsImg">

                                <div className="settingsImgDiv">
                                    <Image src={settings} />
                                </div>

                            </div>


                            <div className="notice text">

                                Alrighty, let's talk about those little dots! 🔴
                                <br />
                                <br />
                                When you pop in your info or make updates, keep an eye on that dot. If it's rockin' red, it means your data isn't locked in yet. No biggie, just give it another shot.
                                <br />
                                <br />
                                But, when that dot goes all green 🟢,  you're in the clear! Your info is saved and sound  😎 ✅

                            </div>

                        </div>

                        <div className="status howtouse-container">

                            <h3 className="subtitle">5. REMINDERS</h3>

                            <p className='text'> Check it out, you're gonna spot a reminder like this popping up right on your webpage! 📢</p>

                            <div className="reminderImg">

                                <div className="reminderImgDiv">
                                    <Image src={reminder} />
                                </div>

                            </div>

                            <p className="text">
                                Boom! Here's the deal: you can open this bad boy up by clicking on the expand icon, and guess who's waiting inside? Our trusty cat soldiers, all geared up to keep you motivated and hustling!
                                <br />
                                <br />
                                And hey, feeling like a random challenge? Click on "Solve Random Easy Question," and it'll whisk you away to a surprise Leetcode question.
                                <br />
                                <br />
                                Oh, and don't forget to keep an eye on your email and Discord if you've dropped those deets. Reminders are coming your way! 😺✉️🚀
                            </p>

                            <div className="expandImg">

                                <div className="expandImgDiv">
                                    <Image src={expand} />
                                </div>

                            </div>

                        </div>


                    </div>




                </div>

            </section>

        </>
    )
}
