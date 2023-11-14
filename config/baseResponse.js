const baseResponse = {
    // Success
    SUCCESS: { status: "SUCCESS", code: 1000, message: "성공" },
  
    //FAIL
    SEARCH_KEYWORD_EMPTY: { status: "FAIL", code: 2000, message: "검색 키워드를 입력해야 합니다." },
    SORT_BY_UNAVAILABLE: { status: "FAIL", code: 2001, message: "올바른 정렬 기준이 아닙니다." },
    LOCATION_EMPTY: { status: "FAIL", code: 2003, message: "위치 정보가 없습니다." },
    RECORDS_USERID_READ_FAIL: { status: "FAIL", code: 2004, message: "기록 - 유저 아이디 읽기 실패" },
    PLACE_NOT_FOUND: { status: "FAIL", code: 2005, message: "장소가 존재하지 않습니다." },
    NOT_FRIEND: { status: "FAIL", code: 2006, message: "친구가 아닌 유저입니다." },
    USER_NOT_FOUND: { status: "FAIL", code: 2007, message: "존재하지 않는 유저입니다." },
    REVIEW_NOT_FOUND: { status: "FAIL", code: 2008, message: "리뷰가 존재하지 않습니다." },
    NEWS_NOT_FOUND: { status: "FAIL", code: 2009, message: "소식이 존재하지 않습니다." },
    BOOKS_NOT_FOUND: { status: "FAIL", code: 2010, message: "책이 존재하지 않습니다." },
    ACTIVITY_ACTIVITYID_EMPTY: { status: "FAIL", code: 2100, message: "존재하지 않는 activityId" },
    NOT_EMAIL_EXP: { status: "FAIL", code: "2009", message: "이메일 형식이 아닙니다." },
    CATEGORY_UNAVAILABLE: { status: "FAIL", code: 2010, message: "올바른 카테고리가 아닙니다." },
    RECORDID_NOT_FOUND: { status: "FAIL", code: 2011, message: "존재하지 않는 기록입니다." },
    ALREADY_FOLLOWED: { status: "FAIL", code: 2012, message: "이미 친구로 등록된 회원입니다." },
    COMMENT_NOT_FOUND: { status: "FAIL", code: 2012, message: "존재하지 않는 댓글입니다." },
    IS_NOT_COMMENT_OWNER: { status: "FAIL", code: 2013, message: "댓글을 쓴 유저가 아닙니다." },
    JWT_TOKEN_EMPTY: { status: "FAIL", code: 2013, message: "JWT 토큰이 없습니다." },
    JWT_VERIFICATION_FAILED: { status: "FAIL", code: 2014, message: "JWT 검증에 실패했습니다." },
    IS_NOT_REVIEW_OWNER: { status: "FAIL", code: 2015, message: "리뷰 작성자가 아닙니다." },
    ACCESS_TOKEN_EXPIRED: { status: "FAIL", code: 2016, message: "Access Token이 만료되었습니다. 재발급 하십시오." },
    INVALID_SIGNUP_REQ: { status: "FAIL", code: 2017, message: "올바르지 않은 가입 형식입니다." },
    NOT_FOLLOWED: { status: "FAIL", code: 2017, message: "친구로 등록하지 않은 회원입니다." },
    IS_NOT_RECORD_OWNER: { status: "FAIL", code: 2018, message: "기록을 쓴 유저가 아닙니다." },
    REFRESH_TOKEN_EXPIRED: { status: "FAIL", code: 2019, message: "Refresh Token이 만료되었습니다. 재로그인 하십시오." },
    NO_BOOK_TITLE: { status: "FAIL", code: 2020, message: "책 제목이 없습니다." },
    NO_BOOK_ISBN: { status: "FAIL", code: 2020, message: "책 ISBN이 없습니다." },
    TOKEN_EMPTY: { status: "FAIL", code: 2030, message: "토큰이 존재하지 않습니다." },
    TOKEN_VERIFICATION_FAILURE: { status: "FAIL", code: 2031, message: "토큰이 일치하지 않습니다." },
    SIGNIN_FAILED: { status: "FAIL", code: 2032, message: "사용자가 없거나 비밀번호가 일치하지 않습니다." },
    SIGNIN_INACTIVE_ACCOUNT: { status: "FAIL", code: 2034, message: "활성화된 계정이 아닙니다." },
    REFRESH_TOKEN_SAVE_ERROR: { status: "FAIL", code: 2035, message: "Refresh 토큰 저장에 실패했습니다." },
    ACTIVITY_NOT_FOUND: { status: "FAIL", code: 2036, message: "존재하지 않는 활동입니다." },
    ACTIVITY_NOT_LIKED: { status: "FAIL", code: 2037, message: "좋아요가 되어있지 않습니다." },
    ACTIVITY_ALREADY_LIKED: { status: "FAIL", code: 2038, message: "이미 좋아요한 활동입니다." },
    PLACE_ID_NOT_FOUND: { status: "FAIL", code: 2039, message: "요청에 장소 id가 존재하지 않습니다." },
    CANNOT_BOOKMARK: { status: "FAIL", code: 2040, message: "북마크를 할 수 없습니다." },
    BOOKMARK_NOT_FOUND: { status: "FAIL", code: 2041, message: "북마크하지 않은 장소입니다." },
    CANNOT_UNBOOKMARK: { status: "FAIL", code: 2042, message: "북마크 해제를 할 수 없습니다." },

    //FAIL
    UNDEFINED_VALUE: {status: "FAIL", code: 400, message: "POST한 데이터의 내용이 미완성입니다."},

    // 404
    UNKNOWN_URL: { status: "ERROR", code: 404, message: "존재하지 않는 URL입니다."},
  
    //ERROR
    SERVER_ERROR: { status: "ERROR", code: 3000, message: "서버 에러" },
  };
  
// export default baseResponse;

module.exports = baseResponse;