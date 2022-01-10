/**
 * Responds to any HTTP request.
 *
 * @param {!express:Request} req HTTP request context.
 * @param {!express:Response} res HTTP response context.
 */
const { initializeApp } = require('firebase-admin/app');
  
 var admin = require("firebase-admin");
 var serviceAccount = require("./serviceAccountKey.json");
 const cookieSession = require('cookie-session');

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

app.use(cookieSession({
    name: 'google-auth-session',
    keys: ['key1', 'key2']
}))

const passport = require("passport")
require('./passport.js');
app.use(passport.initialize());
app.use(passport.session());

 // Automatically allow cross-origin requests
 app.use(cors());

 const jwt = require('jsonwebtoken');
 const verify = (req, res, next) => {
    const SECRET_KEY = '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';
    const token = req.headers.authorization;
    jwt.verify(token, SECRET_KEY, (err, decoded) => {
        if (err) {
            res.status(401).send(err);
            return;
        }
        next();
    })
 }

 // build multiple CRUD interfaces:
 app.get('/', verify, get.trigger);

 app.post('/order', verify, post_order.trigger);

 
 // Expose Express API as a single Cloud Function:
 exports.tickets = functions.https.onRequest(app);
  