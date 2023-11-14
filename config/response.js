const response = ({ status, code, message }, result) => ({
    status,
    code,
    message,
    result: result ?? null,
});

// export default response;
module.exports = response;