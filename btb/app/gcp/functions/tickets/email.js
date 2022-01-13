 const nodemailer = require('nodemailer');
 const mg = require('nodemailer-mailgun-transport');
const api_key_base = 'OWZhNTYxZmNmODYzODU4NWFhY2Q4ZWM0YmZjZWUwZWQtNzZmMTExYzQtZjM1NWIzMTg=';
const api_key = atob(api_key_base)
const sender = atob('YnVzdGlja2V0Ym9va2luZ3N1cHBvcnRAc2FuZGJveDBiZjUyNjUzNTJkNzRiN2I4ZGQ2YzY4M2YwZmYzOWFhLm1haWxndW4ub3Jn')
const domain = atob('c2FuZGJveDBiZjUyNjUzNTJkNzRiN2I4ZGQ2YzY4M2YwZmYzOWFhLm1haWxndW4ub3Jn')
// Mailgun authentication
 const auth = {
     auth: {
         api_key: api_key, // Mailgun API key
         domain: domain // Mailgun domain ie. mg.mydomain.com
     },
     host: 'api.eu.mailgun.net' // for non-eu only api.moailgun.net
 }

 const nodemailerMailgun = nodemailer.createTransport(mg(auth)); // mailgun instance

 module.exports = {
     send: (recipient, subject, htmlMessage) => {
         nodemailerMailgun.sendMail({
             from: sender, // environment variable for sender
             to: '<btbsystemproject@gmail.com>', // An array if you have multiple recipients.
             cc: "", // cc or empty
             subject: subject, // subject (from the post request)
             html: htmlMessage, // html emailfdf body (from the post request )
         }, (err, info) => {
             if (err) {
                 console.error(err)
                 throw new Error('Not successful');
             }
         })
     }
 }