const express = require("express");
const path = require('path');
const http = require('http');
const socketio = require('socket.io');
const Filter = require('bad-words');

const { generateMessage, generateLocationMessage} = require('./utils/messages');
const { addUser, removeUser, getUser, getUsersInRoom } = require('./utils/users');

const app = express();
const server = http.createServer(app);
const io = socketio(server);


const port = process.env.PORT || 3000
const publicDir = path.join(__dirname, '../public');

//set static directory to serve
app.use(express.static(publicDir));

io.on('connection', (socket)=> {
    console.log('New web socket connection!');
    let adminUsername = 'Admin'

    socket.on('join', ({username, room}, callback) => {
        console.log('connection join');
        

        const {error, user} = addUser({id: socket.id, username, room});

        if(error) {
            return callback(error);
        }

        socket.join(user.room);

        socket.emit('message', generateMessage(adminUsername,'Welcome!'));
        socket.broadcast.to(user.room).emit('message', generateMessage(adminUsername, `${user.username} has joined!`));
      
        io.to(user.room).emit('roomData', {
            room: user.room,
            users: getUsersInRoom(user.room)
        });

        callback();
    })

    socket.on('sendMessage', (message, callback) => {
        const {error, user} = getUser(socket.id);
       
        if(error) {
            return callback(error);
        }

        const filter = new Filter();

        if(filter.isProfane(message)) {
            return callback('Profanity is not allowed!')
        }

        io.to(user.room).emit('message', generateMessage(user.username, message));
        callback();
    });

    socket.on('sendLocation', ({lat, lon}, callback) => {
        const user = getUser(socket.id);

        const url = `https://google.com/maps?q=${lat},${lon}`;
        io.to(user.room).emit('locationMessage', generateLocationMessage(user.username, url));
        callback();
    });

    socket.on('disconnect', () => {
        const user = removeUser(socket.id);
        let adminUsername = 'Admin'
 
        if(user) {
            io.to(user.room).emit('message', generateMessage(adminUsername, `${user.username} has left`));
            io.to(user.room).emit('roomData', {
                room: user.room,
                users: getUsersInRoom(user.room)
            });
        }
    });

});


app.get('/', (req, res) => {
    res.render('index');
})


server.listen(port, () => {
  console.log("Server is running on port " + port);
});


//socket.emit - send event to specific client
//io.emit - send event to every connected client
//socket.broadcast.emit - send event to every connected client except for particular one
