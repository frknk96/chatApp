const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20');

// models
const User = require('../models/users');

passport.use(
    new GoogleStrategy({
            clientID: process.env.GOOGLE_LOGIN_CLIENT_ID,
            clientSecret: process.env.GOOGLE_LOGIN_SECRET_ID,
            callbackURL: process.env.GOOGLE_LOGIN_CALLBACK_URL
        },
        ((accessToken, refreshToken, profile, done) => {
            const data = profile._json;
           // console.log(data);

            User.findOrCreate({ // mongodb de ara varsa getir yoksa oluştur
                'googleId' : data.sub
            },{
                name:data.given_name,
                surname:data.family_name,
                profilePhotoUrl:data.picture
            }, (err,user) => {
                return done(err,user);
                })
        })
    ));

passport.serializeUser((user,done) => {  //dönen userin sessiona atanması için
    done(null,user);
});

passport.deserializeUser((user,done) => { //uygulamanın herhangi bir yerinden session datasını değiştirmek istersek
    done(null,user);
});

module.exports = passport;