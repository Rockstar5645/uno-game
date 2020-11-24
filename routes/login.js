let express = require('express');
let router = express.Router();

let authenticate_user = require('../services/authenticate_user.js'); 

// localhost/login/
router.get('/', function (req, res, next) {
    res.render('login', { title: 'UNO' });
});

router.post('/', function(req, res, next) {

    authenticate_user(req).then((result) => {
        if (result == 'success') {
            res.redirect('/lobby');
        } else {
            result.title = 'UNO'; 
            res.render('login', result); 
        }
    }); 
});

module.exports = router;
