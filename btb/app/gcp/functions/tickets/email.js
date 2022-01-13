 const nodemailer = require('nodemailer');

const smtpTransport = nodemailer.createTransport("smtps://btbsystemproject%40gmail.com:"+encodeURIComponent(atob('V2lla3N6eVNhbW9jaG9kQmlsZXRaYW1hd2lhbmllUHJvamVrdC4xMjM=')) + "@smtp.gmail.com:465"); 

 module.exports = {
     send: (recipient, subject, htmlMessage) => {

         const mailOptions = {
             from: "BusTicketBooking System ✔ <btbsystemproject@gmail.com>", // sender address
             to: recipient, // list of receivers
             subject: subject, // Subject line
             html: htmlMessage // html body
         }

         smtpTransport.sendMail(mailOptions, function (error, response) {
             if (error) {
                 console.log(error);
             } else {
                 console.log("Message sent: " + response.message);
             }
         });
     }
 }