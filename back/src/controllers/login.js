const express = require("express");
const bcrypt = require("bcrypt");
const Register = require("../models/register");

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const data = await Register.findOne({ email });

        if (data == null) {
            res.status(401).json({ "msg": "User does not exist." });
        }else{
            const verify = await bcrypt.compare(password, data.password);
    
            if (!verify) {
                res.status(401).json({ "msg": "Email or Password invalid." });
            }else{
                const token = await data.generateToken();
                res.status(201).json({ "msg": "User Login successfully.", token: token, name: data.name });
            }
        }
    } catch (err) {
        res.status(400).json({ "msg": "Bad request." });
    }
};

module.exports = loginUser