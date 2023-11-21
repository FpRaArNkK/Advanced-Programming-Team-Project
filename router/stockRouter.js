const express = require('express');
const router = express.Router();
const baseResponse = require('../config/baseResponse');
const response = require('../config/response');
const stockController = require('../controller/stockController');
// const pythonController = require('../controller/pythonController');
// const User = require('../schemas/userinfo');
// const common = require('../controller/common');

// const cors = require('cors');
// router.use(cors());

router.get('/search/:type', stockController.search);
router.post('/post/stocks', stockController.post_stocks);
router.post('/post/weights', stockController.post_weights);
router.post('/post/portfolio/:model', stockController.portfolio_recommend);
router.get('/get/result',stockController.get_chart_and_result);

module.exports = router;