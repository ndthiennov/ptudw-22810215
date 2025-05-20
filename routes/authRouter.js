'use strict'

let express = require('express');
let router = express.Router();
let controller = require('../controllers/authController');

router.get('/login', controller.show);
router.post('/login', controller.login);

module.exports = router;