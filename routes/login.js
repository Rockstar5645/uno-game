let express = require('express');
let router = express.Router();

let authenticate_user = require('../services/authenticate_user.js');
let userService = require('../services/users');

// localhost/login/
router.get('/', async function (req, res, next) {
    if (req.cookies.user_id) {

        let game_status = await userService.check_if_in_game(req.cookies.user_id);
        if (game_status.in_game === true) {
            let redirection = '/games/' + game_status.game_id;
            console.log('redirecting to:', redirection);
            res.redirect(redirection);
            return;
        }
        res.redirect('/lobby');
    } else {
        res.render('login', { title: 'UNO' });
    }
});

router.post('/', function (req, res, next) {

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
