const express = require("express");
const Commit = require("../models/commit");

const addCommit = async (req, res) => {
    try {
        const {text, ques_id} = req.body;
        
        const data = Commit({
            text,
            ques_id,
            user_id: req.user._id
        });
    
        await data.save();
        res.status(201).json({"msg": "Commit added successfully."});
    } catch (err) {
        res.status(400).json({"msg": "Bad request."});
    }
};

module.exports = addCommit