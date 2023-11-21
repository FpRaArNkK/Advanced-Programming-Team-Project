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
                pythonController.get_names_by_index(index)
                .then((result) => {
                    // console.log(result)
                    // 줄 바꿈 문자인 \n을 공백으로 치환하여 줄 바꿈을 제거
                    stringValues = result.replace(/\n/g, '');

                    // 작은 따옴표를 추가한 후에 큰 따옴표로 묶고, 제거해줍니다.
                    stringValues = stringValues.slice(2, -2);

                    // 문자열을 배열로 변환
                    let resultVal = stringValues.split("' '");

                    res.status(200).json(response(baseResponse.SUCCESS,resultVal));
                })
                .catch((error) => {
                    console.error('Error:', error);
                    res.status(500).json(response(baseResponse.SERVER_ERROR, error));
                });
                break;
            default:
                res.status(500).json(response(baseResponse.SERVER_ERROR, "잘못된 searchType 입력값입니다"));
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
            res.status(200).json(response(baseResponse.SUCCESS, input_array));
        } catch (err) {
            console.log(err);
            res.status(500).json(response(baseResponse.SERVER_ERROR, error.message));
        }
    },

    post_weights: async (req,res) => {

        if (req.session.user_id == undefined) {
            // res.status(500).json(response(baseResponse.SERVER_ERROR, "세션ID가 존재하지 않습니다"));
            res.redirect('/');
            return;
        }

        const post = req.body;
        // console.log(post);
        // const names = post.names;
        // const trimmed = names.replace(/'/g, ''); // 따옴표 제거
        // // const stock_array = trimmed.slice(1, -1).split(',');
        // const stock_array = trimmed.split(',');

        // const weights = post.weights;
        // // const weight_array = weights.slice(1, -1).split(',');
        // const weight_array = weights.split(',');


        // let input_array = [];

        // for (let i = 0; i < stock_array.length; i++) {
        //     const selected_stock = { stock: stock_array[i], weight: weight_array[i] };
        //     input_array.push(selected_stock);
        // }

        // 빈 배열 생성
        let input_array = [];

        // rawData 객체를 배열로 변환
        for (let i = 0; i < Object.keys(post).length / 2; i++) {
            // 객체를 생성하고 배열에 추가
            input_array.push({
                stock: post[`${i}[names]`],
                weight: parseInt(post[`${i}[weights]`], 10) // weights 속성을 숫자로 변환
            });
        }

        try {
            const query = { selected_stocks: input_array };
            console.log(`UPDATE : session.user_id = ${req.session.user_id}, query = ${query}`);
            const result = await  User.findByIdAndUpdate(req.session.user_id, query); // id 에 해당하는 doc 의 정보를 query 의 내용대로 수정
            req.session.selected_stocks = input_array; 
            res.status(200).json(response(baseResponse.SUCCESS, input_array));
        } catch (err) {
            console.log(err);
            res.status(500).json(response(baseResponse.SERVER_ERROR, error.message));
        }
    },

    portfolio_recommend: async (req,res) => {
        const post = req.body;
        const model_name = req.params.model;
        const stock_array = post.names;
        const start_date = post.start_date;
        const end_date = post.end_date;
        // const selected_stocks = req.session.selected_stocks
        // const start_date = req.session.invest_start;
        // const end_date = req.session.invest_end;

        // const stock_array = [];
        // // 객체 배열을 순회하며 stocks 배열에 데이터 추가
        // selected_stocks.forEach(item => {
        //     stock_array.push(item.stock);
        // });

        // console.log(stock_array);
        // const trimmed = names.replace(/'/g, ''); // 따옴표 제거
        // const stock_array = trimmed.slice(1, -1).split(',');

        // console.log(stock_array);

        pythonController.portfolio_recommend(stock_array, model_name, start_date, end_date)
                .then((result) => {
                    // console.log('???');
                    res.status(200).json(response(baseResponse.SUCCESS,result));
                })
                .catch((error) => {
                    console.error('Error:', error);
                    res.status(500).json(response(baseResponse.SERVER_ERROR, error));
                });
    }
}

