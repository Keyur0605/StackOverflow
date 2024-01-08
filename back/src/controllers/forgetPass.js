const express = require("express");
const bcrypt = require("bcrypt");
const nodeMailer = require('nodemailer');
const Register = require("../models/register");

function randomIntFromInterval(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min)
}

const emailid = async (req, res) => {
    try {
        const { email } = req.body;
        const data = await Register.findOne({ email });

        if (data) {
            const token = await data.generateToken();

            const random = randomIntFromInterval(1000, 9999).toString();

            await Register.updateOne({ email }, { $set: { otp: random } });

            const transporter = nodeMailer.createTransport({
                host: "smtp.gmail.com",
                secure: true,
                port: 465,
                auth: {
                    user: process.env.MAIL_ID,
                    pass: process.env.MAIL_PASS,
                },
            });

            const info = {
                from: process.env.MAIL_ID,
                to: email,
                subject: "OTP to reset password",
                html: `<!DOCTYPE html>
                <html lang="en">
                  <head>
                    <meta charset="UTF-8" />
                    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
                    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                    <title>Email verification code</title>
                
                    <link
                      rel="stylesheet"
                      href="https://pro.fontawesome.com/releases/v5.10.0/css/all.css"
                    />
                    <link
                      href="https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700&display=swap"
                      rel="stylesheet"
                    />
                    <style>
                      * {
                        box-sizing: border-box;
                      }
                
                      body {
                        font-family: "Montserrat", sans-serif;
                        margin: 0;
                        padding: 0;
                      }
                
                      img {
                        max-width: 100%;
                      }
                
                      table {
                        border-collapse: collapse;
                      }
                    </style>
                  </head>
                  <body style="background-color: #fff">
                    <table
                      style="
                        margin: auto;
                        background-color: #f4f4f4;
                        max-width: 700px;
                        width: 100%;
                        padding: 50px 20px 20px;
                        display: block;
                        border-collapse: collapse;
                       text-align:center"
                       
                    >
                      <tbody>
                        <tr>
                          <td colspan="2">
                            <div class="header_img">
                            </div>
                          </td>
                        </tr>
                        <tr>
                          <td>
                            <h1 style="font-size:26px;font-weight: 700; margin-bottom: 0px; color: #434245">
                              Confirm your email address
                            </h1>
                            <p style="color: #2d2d2d">
                              Your confirmation code is below — enter it in your open browser
                              window and we'll help you get signed in.
                            </p>
                            <div
                              style="
                                background-color: #fff;
                                padding: 16px 0px;
                                margin: 32px 10px;
                              "
                            >
                              <table style="margin: auto">
                                <tr>
                                  <td
                                    style="
                                      vertical-align: middle;
                                      font-size: 30px;
                                      font-weight: 500;
                                      color: #2d2d2d;
                                    "
                                  >
                                    ${random}
                                  </td>
                                </tr>
                              </table>
                            </div>
                            <p style="padding: 0 0 30px 0; color: #2d2d2d">
                              If you didn’t request this email, there’s nothing to worry about —
                              you can safely ignore it.
                            </p>
                          </td>
                        </tr>
                      </tbody>
                     
                    </table>
                  </body>
                </html>`,
            };

            transporter.sendMail(info, (err) => {
                if (err) {
                    console.log(err);
                } else {
                    console.log("Msg sent.");
                }
            });

            res.status(200).json({ "msg": "Account exist." , token});
        } else {
            res.status(204).json({ "msg": "Account does not exist." });
        }
    } catch (err) {
        res.status(400).json({ "msg": "Bad request." });
    }
}

const otp = async (req, res) => {
    try {
        const { otp } = req.body;
        const data = await Register.findOne({ _id: req.user._id });
        const otpData = data.otp;

        if (otpData == otp) {
            await Register.updateOne({ _id: req.user._id }, { $set: { opt: '' } });
            res.status(200).json({ "msg": "OTP matched." });
        }
        else {
            res.status(204).json({ "msg": "OTP not matched." });
        }
    } catch (err) {
        res.status(400).json({ "msg": "Bad request." });
    }
}

const newPass = async (req, res) => {
    try {
        let { newpass } = req.body;

        if(newpass){
          newpass = await bcrypt.hash(newpass, 10);
          await Register.updateOne({ _id: req.user._id }, { $set: {password: newpass, otp: ''} });
          res.status(201).json({ "msg": "Password reset successfully." });
        }else{
          res.json({ "msg": "Please fill password." });
        }
    } catch (err) {
        res.status(400).json({ "msg": "Bad request." })
    }
}

module.exports = { emailid, otp, newPass }