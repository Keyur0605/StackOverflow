const mongoose = require("mongoose");

const comAnswerSchema = new mongoose.Schema({
    text: {
        type: String,
        required: true
    },
    ans_id: {
        type: String,
        required: true
    },
    user_id: {
        type: String,
        required: true
    }
});

const comAnswer = mongoose.model("com_answer", comAnswerSchema);

module.exports = comAnswer