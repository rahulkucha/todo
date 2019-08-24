var express = require('express');
var router = express.Router();

//controller calls
var UserController = require('./user.controller');

//app.get('/');

export default router.get('/', UserController.index);