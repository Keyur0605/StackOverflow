const express = require("express");
const Register = require("../models/register");

const getProfile = async (req, res) => {
    try {
        const data = await Register.findOne({_id: req.user._id}, {_id: 0, password: 0, provider: 0, otp: 0, __v: 0});
        res.status(200).json(data);
    } catch (err) {
        res.status(500).json({"msg": "Server error."});
    }
};

const getProfileByName = async (req, res) => {
    try {
        const data = await Register.findOne({name: req.params.name}, {_id: 0, password: 0, provider: 0, otp: 0, __v: 0, admin: 0});
        res.status(200).json(data);
    } catch (err) {
        res.status(500).json({"msg": "Server error."});
    }
};

const updateProfile = async (req, res) => {
    try {
        const {name, email, picture, dob, type, gender, tags} = req.body;

        await Register.findOneAndUpdate({_id: req.user._id}, {$set: {name, email, picture, dob, type, gender, tags}});
        res.sendStatus(204);
    } catch (err) {
        res.status(400).json({"msg": "Bad request."});
    }
};

module.exports = {getProfile, getProfileByName, updateProfile}