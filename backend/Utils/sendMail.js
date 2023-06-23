
const nodemailer = require('nodemailer')
const dotenv = require('dotenv').config()


class Mail {

  static sendMail(email , randomQue , image ) {

    return new Promise((resolve, reject) => {

      const transporter = nodemailer.createTransport({

        port: 465,
        host: "smtp.gmail.com",
        auth: {
          user: process.env.NEXT_PUBLIC_NODEMAILER_EMAIL,
          pass: process.env.NEXT_PUBLIC_NODEMAILER_PASS,
        },

        secure: true,

      });

      const mailData = {

        from: process.env.NEXT_PUBLIC_NODEMAILER_EMAIL,
        to: email,
        subject: "Reminder!",
        html:
          `<h3> <p> &#10024; Go Maintain your Streaks </p> </h3>
          </br>
          </br>
          <p> Go to <a href=${randomQue}> Random Que </a> </p>
          </br>
          </br>
          <img src="${image}" alt="img"> `

      };

      transporter.sendMail(mailData, function (err, info) {

        if (err) {
          console.log(err);
          reject(err)
        }
        else {

          resolve(info)

        }

      });

    })


  }


}

module.exports = Mail;