const User = require('../schemas/userinfo');
const common = require('./common');
const response = require('../config/response');
const baseResponse = require('../config/baseResponse');
const pythonController = require('./pythonController');

module.exports = {
    search: async (req,res) => {
        
        const searchType = req.params.type;
        
        const theme = req.query.theme;
        const name = req.query.name;
        const index = req.query.index;

        switch (searchType) {
            case 'theme':
                pythonController.get_names_by_theme(theme)
                .then((result) => {
                    console.log('???');
                    res.status(200).json(response(baseResponse.SUCCESS,result));
                })
                .catch((error) => {
                    console.error('Error:', error);
                    res.status(500).json(response(baseResponse.SERVER_ERROR, error));
                });
                break;
            case 'name':
            case 'index':
            default:
                break;
        }

        // res.status(200).json(response(baseResponse.SUCCESS,"뭐지;"));
        
        // if (post.seed_money == undefined || post.invest_start == undefined || post.invest_end == undefined) {
        //     res.status(400).json(response(baseResponse.UNDEFINED_VALUE, object));
        //     return;
        // }
    
        // try {
        //     const user = await User.create(object);
    
        //     req.session.user_id = user._id;
        //     console.log(req.session.user_id);
    
        //     res.status(200).json(response(baseResponse.SUCCESS,user));
        // } catch (err) {
        //     console.log(err);
        // }
    },
}

