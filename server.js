const http = require("http");
const express = require("express");
const cors = require("cors");
const socketIO = require("socket.io");

const app = express();
const port = process.env.port;
const server = http.createServer(app);
const users = [{}];


app.use(cors());
app.get("/", (req, res) => {
    res.send("hello its working");
})



const io = socketIO(server);

io.on("connection", (socket) => {
    console.log("New Connection");

    socket.on('joined', ({ user }) => {
        users[socket.id] = user;
        console.log(`${user} has joined the chat room`);
        socket.broadcast.emit('userjoined', { user: "Chat hub", message: `${users[socket.id]} has joined` })
        socket.emit('welcome', { user: "Chat hub", message: `Welcome to the chat room, ${users[socket.id]} ` })

        socket.on('disconnect', () => {
            socket.broadcast.emit('left',{user:"Chat hub",message:`${users[socket.id]} has left`});
            console.log('user left');
        })
      
        
        
        socket.on('message',({message,id})=>{
             io.emit('sendmessage',{user:users[id ],message,id})
        })
        
    })


});


server.listen(port, () => {
    console.log(`working`);
})