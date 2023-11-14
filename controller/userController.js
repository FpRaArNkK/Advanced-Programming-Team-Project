const User = require('../schemas/userinfo');
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
        
        if (post.seed_money !== undefined && post.invest_start !== undefined && post.invest_end !== undefined) {
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
    }
}