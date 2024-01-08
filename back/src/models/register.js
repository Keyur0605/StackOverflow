const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const registerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String
    },
    picture: {
        type: String,
        default: ''
    },
    dob: {
        type: Date,
        default: ''
    },
    type: {
        type: String,
        default: 'Other'
    },
    gender: {
        type: String,
        default: ''
    },
    tags: {
        type: Array,
        default: ''
    },
    provider: {
        type: String,
        default: "web"
    },
    otp: {
        type: String,
        default: ''
    },
    block:{
        type: Boolean,
        default: false
    },
    admin: {
        type: Boolean,
        default: false
    }
});

registerSchema.methods.generateToken = async function(){
    try {
        const token = await jwt.sign({_id:this._id.toString()}, process.env.JWT_SECRET_KEY);
        return token;
    } catch (err) {
        res.send(err);
    }
};

registerSchema.pre("save", async function(next){
    if(this.isModified("password")){
        this.password = await bcrypt.hash(this.password, 10);
    }
    next();
});

const Register = new mongoose.model("register", registerSchema);

module.exports = Register