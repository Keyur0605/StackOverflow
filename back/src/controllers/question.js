const express = require("express");
const MongoClient = require('mongodb');
const Register = require("../models/register");
const Question = require("../models/question");
const Commit = require("../models/commit");
const Answer = require("../models/answer");
const comAnswer = require("../models/comAnswer");

const addQuestion = async (req, res) => {
    try {
        const { title, description, image, tags } = req.body;
        const data = Question({
            title,
            description,
            image,
            tags,
            user_id: req.user._id,
            user_name: req.user.name
        })
        await data.save();
        res.status(201).json({ "msg": "Question added successfully." });
    } catch (err) {
        res.status(400).json({ "msg": "Bad request." });
    }
};

const getQuestionList = async (req, res) => {
    try {
        const perPage = 10;
        const data = await Question.find({}, { title: 1, description: 1, tags:1 }).skip((req.params.number - 1) * perPage).limit(perPage);
        const totalQuestions = await Question.find().count();
        const dataToSend = {
            page_no: req.params.number,
            total_page_no: Math.ceil(totalQuestions / perPage),
            allData: data
        }
        res.status(200).json(dataToSend);
    } catch (err) {
        res.status(404).json({ "msg": "Page not found." });
    }
};

const getSearchQuestionList = async (req, res) => {
    try {
        const perPage = 10;
        const data = await Question.aggregate([
            {
                '$search': {
                    'index': 'title',
                    'text': {
                        'query': req.params.question,
                        'path': 'title'
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

const getQuestion = async (req, res) => {
    try {
        let dataTosend = {
            data: '',
            user_name: '',
            commits: '',
            answers: ''
        }
        const questionData = await Question.findOne({ _id: req.params.id });
        const { _id, title, description, image, tags, ...rest } = questionData;
        dataTosend.data = { _id, title, description, image, tags };
        const userName = await Register.findOne({ _id: questionData.user_id }, { _id: 0, name: 1 });
        dataTosend.user_name = userName.name;
        var commitArray = await Commit.find({ ques_id: req.params.id }, { __v: 0, ques_id: 0, _id: 0 });
        var commit = []
        var answerArray = await Answer.find({ ques_id: req.params.id }, { __v: 0, ques_id: 0 });
        var answer = []

        var len = commitArray.length;
        var len2 = answerArray.length;

        function a() {
            return res.status(200).json({ ...dataTosend, commits: commit, answers: answer });
        }

        async function commitFun(caseNumber) {
            for (let i = 0; i < len; i++) {
                const commitUserName = await Register.findOne({ _id: commitArray[i].user_id }, { _id: 0, name: 1 });
                commit.push({ text: commitArray[i].text, userName: commitUserName.name });
                if (i == len - 1) {
                    return caseNumber == 1 ? 1 : a
                }
            }
        }

        async function answerFunc(caseNumber) {
            for (let j = 0; j < len2; j++) {
                let temp = answerArray[j];
                const answerUserName = await Register.findOne({ _id: temp.user_id }, { _id: 0, name: 1 });
                var ansCommitArray = await comAnswer.find({ ans_id: temp._id }, { _id: 0, __v: 0, ans_id: 0 });
                var ansCommit = [];
                var len3 = ansCommitArray.length;

                if(len3>0){
                    for (let i = 0; i < len3; i++) {
                        const commitUserName = await Register.findOne({ _id: ansCommitArray[i].user_id }, { _id: 0, name: 1 });
                        ansCommit.push({ text: ansCommitArray[i].text, userName: commitUserName.name });
                    }
                }

                answer.push({ _id: temp._id, text: temp.text, userName: answerUserName.name, ans_commits: ansCommit });
                if (j == len2 - 1) {
                    return caseNumber == 1 ? 1 : a
                }
            }
        }

        if (len > 0 && len2 > 0) {
            let flag = await commitFun(1);
            let flag2 = await answerFunc(1);

            var k = 1;
            while (k > 0) {
                if (flag == 1 && flag2 == 1) {
                    let b = a();
                    break;
                }
                k++;
            };
        } else if (len > 0) {
            let flag = await commitFun(2);
            let response = flag();
        } else if (len2 > 0) {
            let flag2 = await answerFunc(2);
            let response = flag2();
        } else {
            res.status(200).json({ ...dataTosend, commits: commit, answers: answer });
        }
    } catch (err) {
        res.status(500).json({ "msg": "Server error." });
    }
};

const getUserQuestion = async (req, res) => {
    try {
        const data = await Question.find({ user_id: req.user._id }, { user_id: 0 });
        res.status(200).json(data);
    } catch (err) {
        res.status(500).json({ "msg": "Server error." });
    }
};

module.exports = { addQuestion, getQuestionList, getSearchQuestionList, getQuestion, getUserQuestion }