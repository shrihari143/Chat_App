const express= require("express");
const cors= require("cors");
const mongoose= require("mongoose");
const connectDB= require("./db")
const app= express();
const socket= require("socket.io");
const userRoutes= require("./Routes/userRoutes");
const msgRoutes=require("./Routes/msgRoutes");
//const { sendMessageRoute } = require("./public/src/utills/ApiRoutes");

require("dotenv").config();
const path = require('path');
connectDB();
app.use(cors());
app.use(express.json());
app.use("/api/auth",userRoutes );
app.use("/api/msg",msgRoutes );

app.use(express.static(path.join(__dirname,'./public/build')));
app.get("*",function(req,res){
  res.sendFile(path.join(__dirname,"public","build","index.html"));
});



const server =app.listen(process.env.PORT,()=>{
    console.log(`Port is ruuning at ${process.env.PORT}`);
})
const io=socket(server,{
    cors: {
        origin: "http://localhost:3000",
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


