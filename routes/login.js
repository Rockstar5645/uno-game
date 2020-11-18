let express = require('express');
let router = express.Router();

// localhost/login/
router.get('/', function (req, res, next) {
    res.render('login', { title: 'UNO' });
});

router.post('/', function(req, res, next) {
    let username = req.body.username;
    let password = req.body.password; 
    console.log("username: " + username);
    console.log("password: " + password); 
});

module.exports = router;
