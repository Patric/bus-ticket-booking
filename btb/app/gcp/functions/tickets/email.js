 const nodemailer = require('nodemailer');
 const mg = require('nodemailer-mailgun-transport');

 // Mailgun authentication
 const auth = {
     auth: {
         api_key: '1a6860fc97d242abad9525fd1e913c86-76f111c4-a0b23406', // Mailgun API key
         domain: ' sandbox3e974a6acf134ffbbdca487267decf88.mailgun.org' // Mailgun domain ie. mg.mydomain.com
     },
     host: 'api.eu.mailgun.net' // for non-eu only api.moailgun.net
 }
 const nodemailerMailgun = nodemailer.createTransport(mg(auth)); // mailgun instance

 module.exports = {
     send: (recipient, subject, htmlMessage) => {
         nodemailerMailgun.sendMail({
             from: 'busticketbookingsupport@sandbox3e974a6acf134ffbbdca487267decf88.mailgun.org', // environment variable for sender
             to: recipient, // An array if you have multiple recipients.
             cc: "", // cc or empty
             subject: subject, // subject (from the post request)
             html: message, // html email body (from the post request )
         }, (err, info) => {
             if (err) {
                return;
             } else {
                throw new Error('Not successful');
             }
         })
     }
 }