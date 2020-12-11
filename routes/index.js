var express = require('express');
var router = express.Router();

let userService = require('../services/users');

/* GET home page. */
router.get('/', async function (req, res, next) {
  if (req.cookies.user_id) {
    let game_status = await userService.check_if_in_game(req.cookies.user_id);
    if (game_status.in_game === true) {
      let redirection = '/games/' + game_status.game_id;
      console.log('from index, redirecting to:', redirection);
      res.redirect(redirection);
      return;
    }
  }
  res.redirect('login');
});

module.exports = router;
