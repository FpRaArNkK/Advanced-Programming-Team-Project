const mongoose = require('mongoose');
const { Schema } = mongoose;
// const { Types: {ObjectId} } = Schema;

const userSchema = new Schema({
    // user_id: {
    //     type: ObjectId,
    //     required: true
    // }, -> _id로 대체

    seed_money: {
        type: Number,
        // required: true
    },

    invest_start: {
        type: Date,
        // required: true
    },

    invest_end: {
        type: Date,
        // required: true
    },

    selected_stocks: [{
        stock: String,
        weight: Number
    }],

    createdAt: {
        type: Date,
        default: Date.now, // 기본값
    },
});

module.exports = mongoose.model('User', userSchema);