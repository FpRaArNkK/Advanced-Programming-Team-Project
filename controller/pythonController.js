const User = require('../schemas/userinfo');
const common = require('./common');
const response = require('../config/response');
const baseResponse = require('../config/baseResponse');
const spawn = require('child_process').spawn;

module.exports = {
    getNames: async (req,res) => {
        // const spawn = require('child_process').spawn;


        const result_02 = spawn('python3', ['./controller/pyStocks.py']);
        // "카레유", 20"을 파라미터로 전달
        result_02.stdout.on('data', (result)=>{
            // console.log(result.toString());
            // res.status(200).json(response(baseResponse.SUCCESS, result.toString));
            return result;
        });
        result_02.stderr.on('data', (result)=>{
            // console.log(result.toString());
            // res.status(200).json(response(baseResponse.SUCCESS, result.toString));
            return result;
        });

                // const result = spawn('python', ['print.py']);
// 1) child-process의 spawn을 통해 "python print.py" 명령어를 실행하여 파이썬 코드를 구동한다.

// 2) stdout의 'data' 이벤트 리스터를 통해 결과를 받아서 출력한다.
        // result.stdout.on('data', function(data) {
        //     console.log(data.toString());
        //     res.status(200).response(baseResponse.SUCCESS, data.toString);
        // });

        // result.stderr.on('data', function(data) {
        //     console.log(data.toString());
        //     res.status(200).response(baseResponse.SUCCESS, data.toString);
        // });
// 3) 위 코드에서 data를 toString()없이 사용하면, 버퍼가 출력되니 주의.
//   - <Buffer 49 20 61 6d 20 70 79 74 68 6f 6e 0a>

        // const { exec } = require('child_process');

        // exec('python your_script.py', (error, stdout, stderr) => {
        //     const result_02 = spawn('python', ['print.py', '카레유', '20']);
        //     // "카레유", 20"을 파라미터로 전달
        //     result_02.stdout.on('data', (result)=>{
        //         console.log(result.toString());
        //         res.status(200).json(response(baseResponse.SUCCESS, result.toString));
        //     });
        //     result_02.stderr.on('data', (result)=>{
        //         console.log(result.toString());
        //         res.status(200).json(response(baseResponse.SUCCESS, result.toString));
        //     });
        // });
    },

    get_names_by_theme: async (themeCode) => {

        return new Promise((resolve, reject) => {
            let stockGroupList = [];
            // console.log(themeCode);
            switch (themeCode) {
                case 'TE':
                    stockGroupList = [" 전기/전자", " 전기가스업"];
                    break;
                case 'CP':
                    stockGroupList = [" 화학", " 의약품"];
                    break;
                case 'SF':
                    stockGroupList = [" 서비스업", " 금융업", " 은행", " 증권", " 운수창고", " 보험", " 기타"];
                    break;
                case 'CR':
                    stockGroupList = [" 건설업", " 철강및금속", " 비금속광물", " 운수장비", " 종이/목재"];
                    break;
                case 'MP':
                    stockGroupList = [" 기계", " 음식료품", " 섬유/의복", " 의료정밀", " 제조업"];
                    break;
                case 'DC':
                    stockGroupList = [" 유통업", " 통신업"];
                    break;
                default:
                    break;
            }
            // console.log(stockGroupList);
            const result = spawn('python3', ['./controller/pyStocks.py', stockGroupList, "get_names_by_theme"]);
            result.stdout.on('data', (result)=>{
                // console.log(result.toString());
                // res.status(200).json(response(baseResponse.SUCCESS, result.toString));
                // return result;
                resolve(result.toString());
            });
            result.stderr.on('data', (error)=>{
                // console.log(result.toString());
                // res.status(200).json(response(baseResponse.SUCCESS, result.toString));
                // return result;
                reject(error.toString());
            });
        });
    },

    get_names_by_name: async (name) => {
        const stockName = name;
        return new Promise((resolve, reject) => {
            const result = spawn('python3', ['./controller/pyStocks.py', stockName, "get_names_by_name"]);
            result.stdout.on('data', (result)=>{
                resolve(result.toString());
            });
            result.stderr.on('data', (error)=>{
                reject(error.toString());
            });
        });
    },

    get_names_by_index: async (index) => {
        const inputIndex = index;
        return new Promise((resolve, reject) => {
            const result = spawn('python3', ['./controller/pyStocks.py', inputIndex, "get_names_by_index"]);
            result.stdout.on('data', (result)=>{
                resolve(result.toString());
            });
            result.stderr.on('data', (error)=>{
                reject(error.toString());
            });
        });
    },

    portfolio_recommend: async (stock_array, model_name, start_date, end_date) => {
        const input_array = stock_array;
        const model = model_name;

        const s_d = start_date.slice(0, -3).toString();
        const e_d = end_date.slice(0, -3).toString();;

        console.log(input_array);
        return new Promise((resolve, reject) => {
            const result = spawn('python3', ['./controller/pyStocks.py', input_array, "portfolio_recommend_"+model, s_d, e_d]);
            console.log('데이터 처리중...');
            console.log(s_d,e_d);
            result.stdout.on('data', (result)=>{
                const temp = result.toString();
                const temp2 = temp.split('\n');
                const data = temp2.slice(1);

                const separatedItems = data.map(item => {
                    const [stock, weight] = item.split(/\s+/); // 공백을 기준으로 분할
                    return { stock: stock.trim(), weight: parseFloat(weight) }; // 이름과 숫자 추출 후 객체로 반환
                }).filter(item => item.stock && !isNaN(item.weight)); // 이름이 있고, 숫자인 항목만 필터링
                console.log(separatedItems);

                resolve(separatedItems);
                // resolve(result.toString());
            });
            result.stderr.on('data', (error)=>{
                reject(error.toString());
            });
        });
    }
    
}