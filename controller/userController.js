const User = require('../schemas/userinfo');
const common = require('./common');
const response = require('../config/response');
const baseResponse = require('../config/baseResponse');

module.exports = {
    create: async (req,res) => {

        const post = req.body;

        const object = {
            seed_money: post.seed_money,
            invest_start: post.invest_start,
            invest_end: post.invest_end
        };
        
        if (post.seed_money == undefined || post.invest_start == undefined || post.invest_end == undefined) {
            res.status(400).json(response(baseResponse.UNDEFINED_VALUE, object));
            return;
        }

        try {
            const user = await User.create(object);
    
            req.session.user_id = user._id;
            console.log(req.session.user_id);
    
            res.status(200).json(response(baseResponse.SUCCESS,user));
        } catch (err) {
            console.log(err);
        }
    },

    verify: async (req,res) => {
        
        try {
            const result = await User.find({ _id: req.session.user_id});
            res.status(200).json(response(baseResponse.SUCCESS, result));
        } catch (err) {
            console.log(err);
            res.status(500).json(response(baseResponse.SERVER_ERROR, error.message));
        }
    },
    
    update: async (req,res) => {

        const post = req.body;

        const object = {
            seed_money: post.seed_money,
            invest_start: post.invest_start,
            invest_end: post.invest_end
        };

        try {
            // const User = require('../schemas/userinfo');
            const query = { seed_money: object.seed_money, invest_start: object.invest_start, invest_end: object.invest_end };
            const result = await  User.findByIdAndUpdate(req.session.user_id, query, {new : true}); // id 에 해당하는 doc 의 정보를 query 의 내용대로 수정
            req.session.seed_money = object.seed_money;
            req.session.invest_start = object.invest_start;
            req.session.invest_end = object.invest_end;
            res.status(200).json(response(baseResponse.SUCCESS, object));
        } catch (err) {
            console.log(err);
            res.status(500).json(response(baseResponse.SERVER_ERROR, error.message));
        }
    },

    delete: async (req,res) => {
        try {
            // const User = require('../schemas/userinfo');
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
    }
}