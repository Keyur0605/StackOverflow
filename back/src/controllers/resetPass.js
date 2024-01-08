const express = require("express");
const bcrypt = require("bcrypt");
const Register = require("../models/register");

const resetPassword = async (req, res) => {
    try {
        const {resetpassword} = req.body;
    
        if(resetpassword){
            const password = await bcrypt.hash(resetpassword, 10);
            await Register.findOneAndUpdate({_id: req.user._id}, {$set: {password}}, {new: true});
            res.sendStatus(204);
        }else{
            res.json({ "msg": "Please fill password." });
        }
    } catch (err) {
        res.status(400).json({"msg": "Bad request."});
    }
};

module.exports = resetPassword