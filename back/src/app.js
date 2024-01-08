const path = require("path");
require("dotenv").config({ path: __dirname + '/.env' });

require("./db/conn");

const cors = require("cors");
const express = require("express");
const cookieParser = require("cookie-parser");

const jwt = require("jsonwebtoken");
const Auth = require("../src/middleware/auth");

const Register = require("../src/models/register");
const Question = require("../src/models/question");
const Tag = require("../src/models/tags");
const Commit = require("../src/models/commit");
const Answer = require("../src/models/answer");
const comAnswer = require("../src/models/comAnswer");
const Group = require("../src/models/group");
const Message = require("../src/models/message");

const register_router = require("./routes/register");
const login_router = require("./routes/login");
const question_router = require("./routes/question");
const tags_router = require("./routes/tags");
const commit_router = require("./routes/commit");
const answer_router = require("./routes/answer");
const com_answer_router = require("./routes/comAnswer");
const reset_password_router = require("./routes/resetPass");
const user_profile_router = require("./routes/userProfile");
const forget_password_router = require("./routes/forgetPass");
const chat_router = require("./routes/chat");

const port = process.env.PORT || 8000;

const app = express();

app.use(cors({
    origin: "*",
    methods: "GET, POST, PUT, DELETE, PATCH",
    credentials: true,
}));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: false }));
app.use(cookieParser());

app.get("/", (req, res) => {
    res.send("Home Page.");
});

app.use("/register", register_router);
app.use("/login", login_router);
app.use("/question", question_router);
app.use("/tags", tags_router);
app.use("/commit", commit_router);
app.use("/answer", answer_router);
app.use("/answercommit", com_answer_router);
app.use("/resetpassword", reset_password_router);
app.use("/profile", user_profile_router);
app.use("/forgetpassword", forget_password_router);
app.use("/chat", chat_router);

const server = app.listen(port);

const io = require("socket.io")(server, {
    cors: {
        origin: "*",
    }
});

// app.get("/chat", (req, res) => {
//     res.sendFile(path.join(__dirname + "/index.html"));
// })

async function adduser(user_id, user_name, room, socket_id) {
    const group = await Group.findOne({ name: room }, { _id: 0, users: 1 });

    if (group) {
        const usersList = group.users;

        flag = 1;
        for (let i of usersList) {
            if (i.user_id == user_id) {
                flag = 0;
                break;
            }
        }

        if (flag == 1) {
            usersList.push({ user_id, socket_id });
            await Group.updateOne({ name: room }, { $set: { users: usersList } });
        }
    } else {
        const groupDetails = Group({
            name: room,
            users: [{ user_id, socket_id }]
        });

        await groupDetails.save();
    }

    const userDetails = { id: user_id, name: user_name, room };

    return userDetails;
}

io.on("connection", (socket) => {
    socket.on("joinRoom", async (token, adminRoom = '') => {
        const verifyUser = jwt.verify(token, process.env.JWT_SECRET_KEY);
        const userData = await Register.findOne({ _id: verifyUser._id }, { name: 1, type: 1, block: 1 });

        if (adminRoom != '') {
            const user = await adduser(userData._id.toString(), userData.name, adminRoom, socket.id);
            socket.join(user.room);
        } else {
            if (userData.block == false) {
                const user = await adduser(userData._id.toString(), userData.name, userData.type, socket.id);
                socket.join(user.room);
                const privateGroup = await Group.findOne({ name: "Admin" + user.name }, { _id: 1 });

                if (privateGroup) {
                    socket.emit("isPrivateGroup", true);
                }
            } else {
                socket.emit("block", userData.name);
            }
        }
    });

    socket.on("message", async (name, message, room) => {
        const group = await Group.findOne({ name: room }, { _id: 1 });
        const user = await Register.findOne({ name }, { _id: 1 });

        const messageDetails = Message({
            text: message,
            user_id: user._id,
            group_id: group._id.toString()
        });

        await messageDetails.save();

        socket.broadcast.to(room).emit("addmessage", message, name);
    });


    socket.on("blockuser", async (userName) => {
        const user = await Register.findOne({ name: userName }, { type: 1 });
        let usersList = await Group.findOne({ name: user.type }, { _id: 0, users: 1 ,name:1});
        // usersList = usersList.users;

        socket.to(usersList.name).emit("block", userName);

        // for (let i = 0; i < usersList.length; i++) {
        //     if (usersList[i].user_id == user._id) {
        //         // let a = usersList[i].socket_id;
        //         // io.in(a).socketsLeave(user.type);
        //         io.socketsLeave(user.type);

        //     }
        // }
    });

    socket.on("joinPrivateRoom", async (token, name) => {
        const verifyUser = jwt.verify(token, process.env.JWT_SECRET_KEY);
        const userData = await Register.findOne({ _id: verifyUser._id }, { name: 1 });
        const userData2 = await Register.findOne({ name }, { _id: 0, name: 1 });
        const user = await adduser(userData._id.toString(), userData.name, userData.name + userData2.name, socket.id);
        socket.join(user.room);
    });

    socket.on("joinPrivateRoom2", async (token) => {
        const verifyUser = jwt.verify(token, process.env.JWT_SECRET_KEY);
        const userData = await Register.findOne({ _id: verifyUser._id }, { name: 1 });
        const user = await adduser(userData._id.toString(), userData.name, "Admin" + userData.name, socket.id);
        socket.join(user.room);
    });

    socket.on("privateMessage", async (message, token, name) => {
        const verifyUser = jwt.verify(token, process.env.JWT_SECRET_KEY);
        const userData = await Register.findOne({ _id: verifyUser._id }, { _id: 0, name: 1 });

        const group = await Group.findOne({ name: { $in: [userData.name + name, name + userData.name] } }, { _id: 0, name: 1 });

        socket.broadcast.emit("privateaddmessage", message, userData.name);
    });

    socket.on("deleteChat", async (name) => {
        const privateGroup = await Group.findOne({ name: "Admin" + name }, {_id: 0, users: 1});
        const userSocketId = privateGroup.users[1].socket_id;
        socket.to(userSocketId).emit("block", name);
        await Group.deleteOne({ name: "Admin" + name });
    });
});