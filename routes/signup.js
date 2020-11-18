var express = require('express');
var router = express.Router();

// localhost/signup/
router.get('/', function (req, res, next) {
    res.render('signup', { title: 'UNO' });
});

router.post('/', function(req, res, next) {
    let username = req.body.username; 
    let password = req.body.password; 
    let confirmPassword = req.body.confirmPassword; 
    let email = req.body.email; 
    
    console.log(username + ": " + password + ": " + confirmPassword + ": " + email); 
});

module.exports = router;
