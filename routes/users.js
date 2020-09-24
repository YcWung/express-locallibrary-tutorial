var express = require('express');
var router = express.Router();

// require controllers
var user_controller = require("../controllers/userController");

router.get('/sign-up', user_controller.user_sign_up_get);
router.post('/sign-up', user_controller.user_sign_up_post);
router.get('/log-in', user_controller.user_log_in_get);
router.post('/log-in', user_controller.user_log_in_post);
router.post('/log-out', user_controller.user_log_out_post);

module.exports = router;
