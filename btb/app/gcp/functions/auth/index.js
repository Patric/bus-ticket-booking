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
 const post_auth = require('./post-auth.js');
 const post_signin = require('./post-signin.js');

 const firebaseApp = initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://btbticketbooking-default-rtdb.europe-west1.firebasedatabase.app",
  ignoreUndefinedProperties: true
 });

const firestore_settings = { ignoreUndefinedProperties: true };
admin.firestore().settings(firestore_settings);
 
 const express = require('express');
 const cors = require('cors');
 
 const app = express();

 // Automatically allow cross-origin requests
 app.use(cors({ origin: true }));

 app.post('/', post_auth.trigger);

 app.post('/sign-in', post_signin.trigger);

 // Expose Express API as a single Cloud Function:
 exports.auth = functions.https.onRequest(app);
  