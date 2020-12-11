let express = require('express');
let router = express.Router();

let authenticate_user = require('../services/authenticate_user.js'); 

// localhost/login/
router.get('/', function (req, res, next) {
    if (req.cookies.user_id) {
        res.redirect('/lobby'); 
    } else {
        res.render('login', { title: 'UNO' });
    }
});

router.post('/', function(req, res, next) {

    authenticate_user(req).then((result) => {
        if (result.status == 'success') {
            // let cookies = {
            //     user_id: result.user_id,
            //     username: result.username,
            //     avatar: result.avatar
            // }
            // res.cookie(cookies)
            res.cookie('user_id', result.user_id);
            res.cookie('username', result.username);
            res.cookie('avatar', result.avatar);
            res.redirect('/lobby');
        } else {
            result.title = 'UNO'; 
            res.render('login', result); 
        }
    }); 
});

module.exports = router;
