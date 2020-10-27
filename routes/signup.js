var express = require('express');
var router = express.Router();

// localhost/signup/
router.get('/', function (req, res, next) {
    res.render('signup', { title: 'UNO' });
});

module.exports = router;
