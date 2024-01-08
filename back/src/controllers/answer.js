const express = require("express");
const Answer = require("../models/answer");

const addAns = async (req, res) => {
    try {
        const {text, ques_id} = req.body;
        
        const data = Answer({
            text,
            ques_id,
            user_id: req.user._id
        });
    
        await data.save();
        res.status(201).json({"msg": "Answer added successfully."});
    } catch (err) {
        res.status(400).json({"msg": "Bad request."});
    }
};

module.exports = addAns