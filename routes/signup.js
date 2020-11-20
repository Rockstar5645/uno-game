let express = require('express');
let router = express.Router();

let User = require('../models/user');  

// localhost/signup/
router.get('/', function (req, res, next) {
    res.render('signup', { title: 'UNO' });
});

router.post('/', function(req, res, next) {
    let username = req.body.username; 
    let password = req.body.password; 
    let confirmPassword = req.body.confirmPassword; 
    let email = req.body.email;

    User.create(username, password, confirmPassword, email)
        .then((result) => {
            if (result.status === 'success') {
                res.redirect('/lobby'); 
            } else {
                let template_params = {}; 
                template_params.title = 'UNO';
                template_params.status = result.status; 
                template_params.msg = result.msg; 
                
                if (username.length > 0)
                    template_params.username = username; 
                if (password.length > 0)
                    template_params.password = password; 
                if (email.length > 0)
                    template_params.email = email; 
                if (confirmPassword.length > 0)
                    template_params.confirmPassword = confirmPassword; 

                res.render('signup', template_params); 
            }
        });
});

module.exports = router;
