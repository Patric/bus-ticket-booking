/**
 * Responds to any HTTP request.
 *
 * @param {!express:Request} req HTTP request context.
 * @param {!express:Response} res HTTP response context.
 */
 const { initializeApp } = require('firebase-admin/app');
 var admin = require("firebase-admin");
 var serviceAccount = require("./serviceAccountKey.json");

 const functions = require('firebase-functions');
 const get = require('./get.js');
 const post = require('./post.js');

 initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://btbticketbooking-default-rtdb.europe-west1.firebasedatabase.app"
 });


 const express = require('express');
 const cors = require('cors');
 
 const app = express();

 const cookieSession = require('cookie-session');
 app.use(cookieSession({
    name: 'google-auth-session',
    keys: ['key1', 'key2']
}))

const passport = require("passport")
require('./passport.js');
app.use(passport.initialize());
app.use(passport.session());

 // Automatically allow cross-origin requests
 app.use(cors({ origin: true }));
 
 // build multiple CRUD interfaces:
 app.get('/', passport.authenticate('google', {
    scope:
        ['email', 'profile']
}), get.trigger);

 app.put('/', passport.authenticate('google', {
    scope:
        ['email', 'profile']
}), post.trigger);


 // Expose Express API as a single Cloud Function:
 exports.journeys = functions.https.onRequest(app);
  