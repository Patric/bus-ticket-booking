const passport =require("passport")
const GoogleStrategy = require('passport-google-oauth2').Strategy;

passport.serializeUser(function(user, done) {
    done(null, user);
});

passport.deserializeUser(function(user, done) {
        done(null, user);
});

passport.use(new GoogleStrategy({
        clientID:"495530472547-sss6hbrvef98h52teojjn1e6nd8i9df1.apps.googleusercontent.com",
        clientSecret:"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",
        callbackURL: "http://google.com",
        passReqToCallback   : true
    },
    function(request, accessToken, refreshToken, profile, done) {
            return done(null, profile);
    }
));