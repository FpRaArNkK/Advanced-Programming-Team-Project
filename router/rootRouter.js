const express = require('express');
const router = express.Router();
const baseResponse = require('../config/baseResponse');
const response = require('../config/response');
const userController = require('../controller/userController');
const pythonController = require('../controller/pythonController');
const User = require('../schemas/userinfo');
const common = require('../controller/common');

router.post('/create', userController.create);
router.get('/verify', userController.verify);
router.post('/update', userController.update);
router.get('/delete', userController.delete);

router.get('/test', pythonController.getNames);


module.exports = router;    