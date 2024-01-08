const express = require("express");
const Register = require("../models/register");
const Messsage = require("../models/message");
const Group = require("../models/group");

const getChat = async (req, res) => {
    const group = await Group.findOne({ name: req.params.room });

    if (group) {
        const messageData = await Messsage.find({ group_id: group._id }, { _id: 0, text: 1, user_id: 1 });

        if (messageData.length > 0) {
            for (let i = 0; i < messageData.length; i++) {
                const userData = await Register.findOne({ _id: messageData[i].user_id }, { _id: 0, name: 1 });
                const dataToSend = { message: messageData[i].text, name: userData.name };
                messageData.splice(i, 1, dataToSend);
                if (i == (messageData.length - 1)) {
                    res.status(200).json(messageData);
                }
            }
        } else {
            res.status(200).json({ "msg": "There is no message yet." });
        }
    } else {
        res.sendStatus(204);
    }
};

let blockAndUnblock = async (req, res) => {
    const userData = await Register.findOne({ name: req.params.name }, { _id: 1, name: 1 , block: 1});
    const group = await Group.findOne({ name: req.params.groupname });
    const usersList = group.users;

    for (let i = 0; i < usersList.length; i++) {
        const j = usersList[i];
        if (j.user_id == userData._id) {
            await Register.updateOne({name: userData.name}, {$set: {block: userData.block ? false : true}});
            res.sendStatus(204);
        }
    }
}

const sendUserList = async (req, res) => {
    const group = await Group.findOne({ name: req.params.groupname });

    if (group) {
        const usersList = group.users;

        if (usersList != null) {
            for (let i = 0; i < usersList.length; i++) {
                let j = usersList[i];
                const userData = await Register.findOne({ _id: j.user_id }, { _id: 0, name: 1, picture: 1, block: 1 });
                usersList[i].name = userData.name;
                usersList[i].block = userData.block;
                usersList[i].picture = userData.picture;
                delete usersList[i].user_id;
                delete usersList[i].socket_id;
                if (i == (usersList.length - 1)) {
                    res.status(200).json(usersList);
                }
            }
        } else {
            res.status(200).json({ "msg": "There is no users yet." });
        }
    } else {
        res.sendStatus(204);
    }
};

module.exports = { getChat, blockAndUnblock, sendUserList }