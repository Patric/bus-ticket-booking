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

const functions = require('firebase-functions');
const post_auth = require('./post-auth.js');
const post_signin = require('./post-signin.js');

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

app.use(cookieSession({
    name: 'google-auth-session',
    keys: ['key1', 'key2']
}))

app.use(passport.initialize());
app.use(passport.session());

const app = express();

const isLoggedIn = (req, res, next) => {
    if (req.user) {
    next();
    } else {
    res.sendStatus(401);
    }
    }

// Automatically allow cross-origin requests
app.use(cors({
    origin: true
}));

app.get("/", (req, res) => {
    res.json({message: "You are not logged in"})
})

app.get("/failed", (req, res) => {
    res.send("Failed")
})

app.get("/success",isLoggedIn, (req, res) => {
    res.send(`Welcome ${req.user.email}`)
})

app.get('/google',
    passport.authenticate('google', {
            scope:
                ['email', 'profile']
        }
    ));

app.get('/google/callback',
    passport.authenticate('google', {
        failureRedirect: '/failed',
    }),
    function (req, res) {
        res.redirect('/success')

    }
);

app.get("/logout", (req, res) => {
    req.session = null;
    req.logout();
    res.redirect('/');
})

//  app.post('/', post_auth.trigger);

//  app.post('/sign-in', post_signin.trigger);

// Expose Express API as a single Cloud Function:
exports.auth = functions.https.onRequest(app);