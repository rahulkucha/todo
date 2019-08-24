var express = require('express');
var router = express.Router();
//controller calls
var UserController = require('./user.controller');
exports["default"] = router.get('/', UserController.index);
