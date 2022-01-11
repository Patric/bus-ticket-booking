/**
 * Responds to any HTTP request.
 *
 * @param {!express:Request} req HTTP request context.
 * @param {!express:Response} res HTTP response context.
 */
const {
    initializeApp
} = require('firebase-admin/app');

var admin = require("firebase-admin");
var serviceAccount = require("./serviceAccountKey.json");
const passport = require("passport")
const cookieSession = require('cookie-session');
require('./passport.js');

const functions = require('firebase-functions');

const firebaseApp = initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://btbticketbooking-default-rtdb.europe-west1.firebasedatabase.app",
    ignoreUndefinedProperties: true
});

const firestore_settings = {
    ignoreUndefinedProperties: true
};
admin.firestore().settings(firestore_settings);

const express = require('express');
const cors = require('cors');

const app = express();

app.use(cookieSession({
    name: 'google-auth-session',
    keys: ['key1', 'key2']
}))

app.use(passport.initialize());
app.use(passport.session());

const isLoggedIn = (req, res, next) => {
    if (req.user) {
        next();
    } else {
        res.sendStatus(401);
    }
}

// Automatically allow cross-origin requests
app.use(cors());

app.get("/", isLoggedIn, (req, res) => {
    res.json({
        message: "You are not logged in"
    })
})

app.get("/failed", (req, res) => {
    res.send("Failed")
})

const jwt = require('jsonwebtoken');
app.get("/success", (req, res) => {
    const SECRET_KEY = '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';
    let token = jwt.sign(req.user, SECRET_KEY, {
        expiresIn: 1440
    });
    var responseHTML = '<html><head><title>Authentication</title></head><body></body><script>res = %value%; window.opener.postMessage(res, "*");window.close();</script></html>'
    responseHTML = responseHTML.replace('%value%', JSON.stringify({
        authorization: token
    }));
    res.status(200).send(responseHTML);
})

app.get('/google',
    passport.authenticate('google', {
        scope: ['email', 'profile']
    }));

app.get('/google/callback',
    passport.authenticate('google', {
        failureRedirect: '/auth/failed',
    }),
    function (req, res) {
        res.redirect('/auth/success')
    }
);

// Expose Express API as a single Cloud Function:
exports.auth = functions.https.onRequest(app);