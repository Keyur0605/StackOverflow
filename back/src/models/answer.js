const mongoose = require("mongoose");

const answerSchema = new mongoose.Schema({
    text: {
        type: String,
        required: true
    },
    ques_id: {
        type: String,
        required: true
    },
    user_id: {
        type: String,
        required: true
    }
});

const Answer = mongoose.model("answer", answerSchema);

module.exports = Answer