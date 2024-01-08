const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
    text: {
        type: String,
        required: true
    },
    user_id: {
        type: String,
        required: true
    },
    group_id: {
        type: String,
        required: true
    },
});

const Message = new mongoose.model("message", messageSchema);

module.exports = Message