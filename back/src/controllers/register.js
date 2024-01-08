const express = require("express");
const Register = require("../models/register");

const createUser = async (req, res) => {
    try {
        const {name, email, password} = req.body;
        const data = await Register.findOne({$or: [{name}, {email}]});
    
        if(data != null){
            res.status(409).json({"msg": "Username or email already exist."});
        }else{
            const user = Register({
                name, 
                email, 
                password
            })
    
            await user.save();
    
            const token = await user.generateToken();
            res.status(201).json({"msg": "User created.", token: token});
        }     
    } catch (err) {
        res.status(400).json({"msg": "Bad request."});
    }
};

module.exports = createUser