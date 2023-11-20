const express = require('express');
const router = express.Router();
const baseResponse = require('../config/baseResponse');
const response = require('../config/response');
const userController = require('../controller/userController');
const pythonController = require('../controller/pythonController');
const User = require('../schemas/userinfo');
const common = require('../controller/common');

// const cors = require('cors');
// router.use(cors());

router.get('/', async (req,res) => {

    if (common.checkUserId(req)) { // 세션 이미 존재하는 경우
        userController.verify(req,res);
        return;
    }

    // 세션 없을 때 초기 생성
    const userObject = { seed_money: 0, invest_start: Date.now(), invest_end: Date.now() };

    try {
        const User = require('../schemas/userinfo');
        const user = await User.create(userObject);

        req.session.user_id = user._id;
        console.log(req.session.user_id);

        res.status(200).json(response(baseResponse.SUCCESS,user));
    } catch (err) {
        console.log(err);
    }
});

router.post('/create', userController.create);
router.get('/verify', userController.verify);
router.post('/update', userController.update);
router.get('/delete', userController.delete);

router.get('/test', pythonController.getNames);


module.exports = router;