let express = require('express');
let router = express.Router();

let create_user = require('../services/create_user.js'); 

// localhost/signup/
router.get('/', function (req, res, next) {
    if (req.mySession.user_id) {
        res.redirect('/lobby');
    } else {
        res.render('signup', { title: 'UNO' });
    }
});

router.post('/', function(req, res, next) {
    create_user(req).then((result) => {
        if (result.status === 'success') {
            req.mySession.user_id = result.user_id; 
            res.redirect('/lobby');
        } else {
            result.title = 'UNO'; 
            res.render('signup', result); 
        }
    }); 
});

module.exports = router;
