const express = require('express');
const router = express.Router();
const passportGoogle = require('../auth/google');

router.get('/google',           //Google with butonuna tıklandığında çalışacak kısım
    passportGoogle.authenticate(
        'google',
        {
            scope: ['profile']  //Googleden login olucak kişiden hangi bilgileri istenicek
        }
    ));

router.get('/google/callback',    //Googleden ilgili kullanıcı döndüğünde
    passportGoogle.authenticate(
        'google',
        {
            failureRedirect: '/'  //Login olamama durumunda nereye yönlendirilicek
        }),
    (req, res) => {
        res.redirect('/chat');
    });

module.exports = router;