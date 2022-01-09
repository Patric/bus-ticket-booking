const passport =require("passport")
const GoogleStrategy = require('passport-google-oauth2').Strategy;
const cookieSession = require('cookie-session');

passport.serializeUser(function(user, done) {
    done(null, user);
});

passport.deserializeUser(function(user, done) {
        done(null, user);
});

passport.use(new GoogleStrategy({
        clientID:"495530472547-sss6hbrvef98h52teojjn1e6nd8i9df1.apps.googleusercontent.com",
        clientSecret:"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",
        callbackURL: "https://europe-central2-soy-totem-335520.cloudfunctions.net/auth/google/callback",
        passReqToCallback   : true
    },
    function(request, accessToken, refreshToken, profile, done) {
            return done(null, profile);
    }
));

const cookieSession = cookieSession({
    name: 'google-auth-session',
    keys: ['key1', 'key2']
})

module.exports = {
    cookieSession: cookieSession
  };