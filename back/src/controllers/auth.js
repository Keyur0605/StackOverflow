const express = require("express");
const passport = require("passport");

const isLoggedIn = (req, res, next) => {
    req.user ? next() : res.status(401).send("Unauthorized.");
};

const protected = (req, res) => {
    let data = req.user[0];
    res.status(200).send(data);
};

const failure = (req, res) => {
    res.status(500).json({"msg":"Something went wrong..."});
};

const logout = (req, res) => {
    req.session.destroy();
    res.status(401).send("Logout successfully.");
};

module.exports = {isLoggedIn, protected, failure, logout}