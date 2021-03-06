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
 const post_order = require('./post-order.js');

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
 app.use(cors());

const { verify } = require('./verify.js')

 // build multiple CRUD interfaces:
 app.get('/', verify, get.trigger);

 app.post('/order', verify, post_order.trigger);

 
 // Expose Express API as a single Cloud Function:
 exports.tickets = functions.https.onRequest(app);
  