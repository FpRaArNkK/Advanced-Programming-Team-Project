const baseResponse = {
    // Success
    SUCCESS: { status: "SUCCESS", code: 1000, message: "성공" },

    //FAIL
    UNDEFINED_VALUE: {status: "FAIL", code: 400, message: "POST한 데이터의 내용이 미완성입니다."},

    // 404
    UNKNOWN_URL: { status: "ERROR", code: 404, message: "존재하지 않는 URL입니다."},
  
    //ERROR
    SERVER_ERROR: { status: "ERROR", code: 3000, message: "서버 에러" },
  };
  
// export default baseResponse;

module.exports = baseResponse;