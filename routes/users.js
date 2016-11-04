var express = require('express');
var user = require('../controllers/user');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});
router.post('/upImg',user.upImg);
router.get('/image',user.image);
module.exports = router;
