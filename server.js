const express=require("express");
const path=require("path");
const http=require("http");
const socketio=require("socket.io");
const { log } = require("console");
const formatMessage=require("./utilities/message");
const { userJoin,getCurrUser,userLeave,getRoomUsers }=require("./utilities/user");

const app=express();
const server=http.createServer(app);
const io=socketio(server);


// setting static folder
app.use(express.static(path.join(__dirname,"public")));

const botname="admin";

// Run When client connects
io.on("connection",(socket)=>{
    socket.on("joinroom",({username,room})=>{
        // joining the specific room as selected by user
        const user=userJoin(socket.id,username,room);
        socket.join(user.room);

        // Welcoming the current user
        socket.emit("message",formatMessage(botname,"Welcome to chatcord"));

        // telling others when a client connects
        socket.broadcast.to(user.room).emit("message",formatMessage(botname,`${user.username} has joined the chat`));

        // sending room users info for frontend
        io.to(user.room).emit("roomusers",{
            room:user.room,
            users: getRoomUsers(user.room)
        });

    });
    
    // Listening for chatmsg
    socket.on("chatmsg",(msg)=>{
        const user=getCurrUser(socket.id);
        io.to(user.room).emit("message",formatMessage(user.username,msg));
    });

    // telling others when a client disconnects
    socket.on("disconnect",()=>{
        const user=userLeave(socket.id);
        if(user){
            io.to(user.room).emit("message",formatMessage(botname,`${user.username} has left the chat`));

            // sending room users info for frontend
            io.to(user.room).emit("roomusers",{
               room:user.room,
               users: getRoomUsers(user.room)
           });
        }
        
    });

});



let port=3000|| process.env.port;

server.listen(port,()=>{
    console.log(`listening on port no. ${port}`);
});