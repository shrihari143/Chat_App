const express= require("express");
const cors= require("cors");
const mongoose= require("mongoose");
const connectDB= require("./db")
const app= express();
const socket= require("socket.io");
const userRoutes= require("./Routes/userRoutes");
const msgRoutes=require("./Routes/msgRoutes");


require("dotenv").config();
const path = require('path');
connectDB();
app.use(cors());
app.use(express.json());

app.use("/api/auth",userRoutes );
app.use("/api/msg",msgRoutes );


const server =app.listen(process.env.PORT,()=>{
    console.log(`Port is ruuning at ${process.env.PORT}`);
})
const io=socket(server,{
    cors: {
        origin: "https://64d8d0bb9435f80dd70b57ef--exquisite-faun-7833be.netlify.app/login",
        credentials: true,
      },
});
global.onlineUsers = new Map();
io.on("connection", (socket) => {
  global.chatSocket = socket;
  socket.on("add-user", (userId) => {
    onlineUsers.set(userId, socket.id);
  });

  socket.on("send-msg", (data) => {
    const sendUserSocket = onlineUsers.get(data.to);
    if (sendUserSocket) {
      socket.to(sendUserSocket).emit("msg-recieve", data.msg);
    }
  });
});


