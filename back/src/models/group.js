const mongoose = require("mongoose");

const groupSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    users: {
        type: Array
    },
});

const Group = new mongoose.model("group", groupSchema);

module.exports = Group