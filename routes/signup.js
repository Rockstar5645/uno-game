let express = require('express');
let router = express.Router();

let create_user = require('../services/create_user.js');
let userService = require('../services/users');

// localhost/signup/
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
        res.render('signup', { title: 'UNO' });
    }
});

router.post('/', function (req, res, next) {
    create_user(req).then((result) => {
        if (result.status === 'success') {
            res.cookie('user_id', result.user_id);
            res.redirect('/lobby');
        } else {
            result.title = 'UNO';
            res.render('signup', result);
        }
    });
});

module.exports = router;
