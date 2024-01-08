const express = require("express");
const Tag = require("../models/tags");
const Question = require("../models/question");

const addTag = async (req, res) => {
    try {
        const {name, description} = req.body;
    
        if(name == "" || description == ""){
            res.json({"msg": "Please fill all fields."});
        }

        const data = await Tag.findOne({name});

        if(data){
            res.json({"msg": "Tag already exist."});
        }
        
        const tag = Tag({
            name,
            description
        })

        await tag.save();
        res.status(201).json({"msg": "Tag created."}); 
    } catch (err) {
        res.status(400).json({"msg": "Bad request."});
    }
};

const getTag = async (req, res) => {
    try {
        const data = await Tag.find({}, {_id: 0, __v: 0});
        res.status(200).json(data);
    } catch (err) {
        res.status(500).json({"msg": "Server error."});
    }
};

const getTagName = async (req, res) => {
    try {
        const data = await Tag.find({}, {_id: 0, name: 1});
        res.status(200).json(data);
    } catch (err) {
        res.status(500).json({"msg": "Server error."});
    }
};

const getTagQuestionList = async (req, res) => {
    try {
        const perPage = 10;
        const data = await Question.aggregate([
            {
                '$search': {
                    'index': 'title',
                    'text': {
                        'query': req.params.tag,
                        'path': 'tags'
                    }
                }
            },
            { $project: { title: 1, description: 1, tags:1 } }
        ]).skip((req.params.number - 1) * perPage).limit(perPage);
        const totalQuestions = data.length;
        const dataToSend = {
            page_no: req.params.number,
            number_of_question: totalQuestions,
            total_page_no: Math.ceil(totalQuestions / perPage),
            allData: data
        }
        res.status(200).json(dataToSend);
    } catch (err) {
        console.log(err);
        res.status(404).json({ "msg": "Page not found." });
    }
};

module.exports = {addTag, getTag, getTagName, getTagQuestionList}