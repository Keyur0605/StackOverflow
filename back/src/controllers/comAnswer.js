const express = require("express");
const comAnswer = require("../models/comAnswer");

const addCommit = async (req, res) => {
    try {
        const {text, ans_id} = req.body;
        
        const data = comAnswer({
            text,
            ans_id,
            user_id: req.user._id
        });
    
        await data.save();
        res.status(201).json({"msg": "Commit added successfully."});
    } catch (err) {
        res.status(400).json({"msg": "Bad request."});
    }
};

module.exports = addCommit