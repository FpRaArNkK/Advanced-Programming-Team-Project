module.exports = {
    checkUserId: (req) => {
        if (req.session.user_id !== undefined) {
            return true;
        } else {
            return false;
        }
    }
}