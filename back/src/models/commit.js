const mongoose = require("mongoose");

const commitSchema = new mongoose.Schema({
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

const Commit = mongoose.model("commit", commitSchema);

module.exports = Commit