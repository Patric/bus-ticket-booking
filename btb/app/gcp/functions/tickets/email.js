 const nodemailer = require('nodemailer');
 const mg = require('nodemailer-mailgun-transport');
 const aesjs = require('aes-js')

const key_iv = '$B&E)H@McQfTjWnZ'.split('').map(val => val.charCodeAt(0));
const aesCbc = new aesjs.ModeOfOperation.cbc(key_iv, key_iv);
const api_key_bytes = aesCbc.decrypt(aesjs.utils.hex.fromBytes('a469a555c4c010e864fa5e84ed90a39372c23998be980eaa4bc28eead52e19647fdbd8970cac28add1c3782ef0176a23124cdef516c1d4ca8d18ff611cae1061'));
const api_key = aesjs.utils.utf8.fromBytes(api_key_bytes);
const domain_bytes = aesCbc.decrypt(aesjs.utils.hex.fromBytes('f52accea98eb18276c576c44fc6afdea01bed5eef517cd23a2ec5e7a08f6d2c4aad8fe877be876a2fd1693c519b464f6f6824b40c89d9ddcca3c6fc519237276'));
const domain = aesjs.utils.utf8.fromBytes(domain_bytes);
const sender_bytes = aesCbc.decrypt(aesjs.utils.hex.fromBytes('1706b35e88865cecd837d609ed237db6f1626bfe91fc3515f52037f777f81b7f6698e2f8533118067c52605f5e423cab517a25e37ba877efbe9bd9fd5fc91d76014ac9d003ae476711e4233a57af94a7'));
const sender = aesjs.utils.utf8.fromBytes(sender_bytes);
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