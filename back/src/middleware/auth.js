const express = require("express");
const jwt = require("jsonwebtoken");
const cookieParser = require('cookie-parser');
const Register = require("../models/register");

const Auth = async (req, res, next) => {
    try {
        const token = req.header("Authorization");
        const verifyUser = jwt.verify(token, process.env.JWT_SECRET_KEY);
        const user = await Register.findOne({_id:verifyUser._id});
        req.user = user;
        next(); 
    } catch (err) {
        res.status(401).json({"msg": "User does not exist."});
    }
};

module.exports = Auth