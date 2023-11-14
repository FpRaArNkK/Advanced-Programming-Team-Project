const express = require('express');
const router = express.Router();
const baseResponse = require('../config/baseResponse');
const response = require('../config/response');
const userController = require('../controller/userController');

router.get('/', async (req,res) => {

    const userObject = { seed_money: 1234 };

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

router.get('/verify', async (req,res) => {
 
    try {
        const User = require('../schemas/userinfo');
        const result = await User.find({ _id: req.session.user_id});
        // const result = await User.find({ user_id: 1});
        res.status(200).json(response(baseResponse.SUCCESS, result));
    } catch (err) {
        console.log(err);
        res.status(500).json(response(baseResponse.SERVER_ERROR, error.message));
    }

});

router.get('/update', async (req,res) => {
    try {
        const User = require('../schemas/userinfo');
        const query = { seed_money: 14231234 };
        const result = await  User.findByIdAndUpdate(req.session.user_id, query); // id 에 해당하는 doc 의 정보를 query 의 내용대로 수정
        res.status(200).json(response(baseResponse.SUCCESS, result));
    } catch (err) {
        console.log(err);
        res.status(500).json(response(baseResponse.SERVER_ERROR, error.message));
    }
});

router.get('/delete', async (req,res) => {
    try {
        const User = require('../schemas/userinfo');
        const result = await User.findByIdAndDelete(req.session.user_id);

        req.session.destroy((err) => {
            if (err) {
                console.error('Failed to destroy session:', err);
                res.status(500).json({ success: false, error: 'Failed to destroy session' });
            } else {
                res.clearCookie('connect.sid'); // 세션 쿠키를 지우는 것이 좋습니다.
                res.status(200).json({ success: true, message: 'Logout successful', result });
            }
        });

        // res.status(200).json(response(baseResponse.SUCCESS, result));

    } catch (err) {
        console.log(err);
        res.status(500).json(response(baseResponse.SERVER_ERROR, error.message));
    }
});

module.exports = router;