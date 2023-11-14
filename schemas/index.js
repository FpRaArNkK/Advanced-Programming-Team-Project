const mongoose = require('mongoose');
const config = require('../config/key');

// 몽구스 연결 함수
const connect = async () => {
    mongoose.set('debug', true); // 디버깅용 : 몽고 쿼리가 콘솔에서 뜨게 한다.
    console.log(config.mongoURI);
    try {
      await mongoose.connect(config.mongoURI);  
      console.log('MongoDB connected successfully');
    } catch (error) {
      console.error('MongoDB connection error:', error);
    }

};

// 몽구스 커넥션에 이벤트 리스너를 달게 해준다. 에러 발생 시 에러 내용을 기록하고, 연결 종료 시 재연결을 시도한다.
mongoose.connection.on('error', (error) => {
  console.error('mongoDB connection error', error);
});

mongoose.connection.on('disconnected', () => {
  console.error('mongoDB disconnected. retry.');
  connect(); // 연결 재시도
});

module.exports = connect;