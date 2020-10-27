var express = require('express');
var router = express.Router();

// localhost/login/
router.get('/', function (req, res, next) {
    res.render('login', { title: 'UNO' });
});

module.exports = router;
