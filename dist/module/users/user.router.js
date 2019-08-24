"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require('express');
var router = express.Router();
//controller calls
var UserController = require('./user.controller');
//app.get('/');
exports.default = router.get('/', UserController.index);
//# sourceMappingURL=user.router.js.map