const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  
  console.log(req.cookies);

  if (req.cookies.user_id) {

  } else {
    
  }
  res.cookie('user_id', 2);
  res.send('hi');
});

module.exports = router;
