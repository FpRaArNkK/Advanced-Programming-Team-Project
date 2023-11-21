// 기본 요청 url : mongodb://localhost:27017/admin
//mongodb://username:password@host:port/database
// const adminUrl = 'mongodb://' +
//     'frank:alstj1184!' + // 관리자아이디 : 비밀번호
//     '@' +
//     '54.180.150.186' + // host
//     ':27017' + // port
//     '/admin'; // db : admin db는 로그인을 위한 db 

const baseUrl = 'mongodb://' +
    'frank:alstj1184!' + // 관리자아이디 : 비밀번호
    '@' +
    '3.39.95.95' + // host
    ':27017'; // port

const adminUrl = baseUrl + '/admin';
const stockUrl = baseUrl + '/stockDB';

module.exports = {
    cookieSecret: 'FpRaArNkK',
    adminURI : adminUrl,
    stockURI : stockUrl
};