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
                    res.status(200).json(response(baseResponse.SUCCESS,result));
                })
                .catch((error) => {
                    console.error('Error:', error);
                    res.status(500).json(response(baseResponse.SERVER_ERROR, error));
                });
                break;
            case 'name':
                pythonController.get_names_by_name(name)
                .then((result) => {
                    res.status(200).json(response(baseResponse.SUCCESS,result));
                })
                .catch((error) => {
                    console.error('Error:', error);
                    res.status(500).json(response(baseResponse.SERVER_ERROR, error));
                });
                break;
            case 'index':
            default:
                break;
        }
    },

    post_stocks: async (req,res) => {
        const post = req.body;
        const names = post.names;
        const trimmed = names.replace(/'/g, ''); // 따옴표 제거
        const stock_array = trimmed.slice(1, -1).split(',');


        let input_array = [];

        stock_array.forEach(item => {
            const selected_stock = { stock: item, weight: 0 };
            input_array.push(selected_stock);
        });

        try {
            const query = { selected_stocks: input_array };
            const result = await  User.findByIdAndUpdate(req.session.user_id, query, {new : true}); // id 에 해당하는 doc 의 정보를 query 의 내용대로 수정
            req.session.selected_stocks = input_array; 
            res.status(200).json(response(baseResponse.SUCCESS, result));
        } catch (err) {
            console.log(err);
            res.status(500).json(response(baseResponse.SERVER_ERROR, error.message));
        }
    },

    post_weights: async (req,res) => {
        const post = req.body;

        const names = post.names;
        const trimmed = names.replace(/'/g, ''); // 따옴표 제거
        const stock_array = trimmed.slice(1, -1).split(',');

        const weights = post.weights;
        const weight_array = weights.slice(1, -1).split(',');


        let input_array = [];

        for (let i = 0; i < stock_array.length; i++) {
            const selected_stock = { stock: stock_array[i], weight: weight_array[i] };
            input_array.push(selected_stock);
        }

        try {
            const query = { selected_stocks: input_array };
            const result = await  User.findByIdAndUpdate(req.session.user_id, query, {new : true}); // id 에 해당하는 doc 의 정보를 query 의 내용대로 수정
            req.session.selected_stocks = input_array; 
            res.status(200).json(response(baseResponse.SUCCESS, result));
        } catch (err) {
            console.log(err);
            res.status(500).json(response(baseResponse.SERVER_ERROR, error.message));
        }
    }
}

