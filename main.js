const express = require('express');
const app = express();
const cors = require('cors'); //CORS
app.use(cors({ 
  // origin: ["http://54.180.150.186:3000", "http://localhost:3000"],
  origin: '*',
  credentials: true
}));

// Router
const rootRouter = require('./router/rootRouter');
const stockRouter = require('./router/stockRouter');

// MongoDB Connect
const connect = require('./schemas');
connect().then(() => {

  // Session Modules
  const config = require("./config/key"); // 세션키
  const session = require('express-session');
  const MongoStore = require("connect-mongo");

  // Session connect
  app.use(
    session({
      secret: config.cookieSecret, //암호 키 저장, 이 키를 통하여 Session id를 암호화한다.
      resave: false, //재저장을 계속 할 것인지 정보, 세션에 변화가 없어도 계속 저장한다는 옵션이다.(false 권장)
      saveUninitialized: false, //saveUninitialized : True일 경우 세션 저장 전 unitialized 상태로 미리 저장한다
      store: MongoStore.create({ mongoUrl: config.stockURI }), //세션 데이터의 저장소 설정 
      cookie: { maxAge: 3.6e6 * 24 }, // 24시간 뒤 만료(자동 삭제)
    })
  );

  // bodyParser
  const bodyParser =require('body-parser');
  app.use(bodyParser.urlencoded({extended: false}));

  // 정적 파일 폴더 지정
  app.use(express.static('data'));

  // 라우터 호출
  app.use('/', rootRouter);
  app.use('/stock', stockRouter);

  // 만일 위 라우터에서 요청이 end되지않으면 실행 -> 라우터 없음
  const baseResponse = require('./config/baseResponse');
  const response = require('./config/response');
  app.use((req, res, next) => {
      res.status(404).json(response(baseResponse.UNKNOWN_URL));
  });

  app.listen(4000, () => console.log('app listening on port 3000'));

}).catch((err) => {
  console.error(err);
});

