const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    image: {
        type: String
    },
    tags: {
        type: Array
    },
    user_id: {
        type: String,
        required: true
    }
});

const Question = mongoose.model("question", questionSchema);

module.exports = Question