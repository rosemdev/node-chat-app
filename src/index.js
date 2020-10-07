const express = require("express");
const path = require('path');
const http = require('http');
const socketio = require('socket.io');
const Filter = require('bad-words');

const {generateMessage, generateLocationMessage} = require('./utils/messages')

const app = express();
const server = http.createServer(app);
const io = socketio(server);


const port = process.env.PORT || 3000
const publicDir = path.join(__dirname, '../public');

//set static directory to serve
app.use(express.static(publicDir));

io.on('connection', (socket)=> {
    console.log('New web socket connection');

    socket.on('join', ({username, room}) => {
        socket.join(room);

        socket.emit('message', generateMessage('Welcome!'));
        socket.broadcast.to(room).emit('message', generateMessage(`${username} has joined!`));


    })

    socket.on('sendMessage', (message, callback) => {
        const filter = new Filter();

        if(filter.isProfane(message)) {
            return callback('Profanity is not allowed!')
        }

        io.emit('message', generateMessage(message));
        callback();
    });

    socket.on('sendLocation', ({lat, lon}, callback) => {
        const url = `https://google.com/maps?q=${lat},${lon}`;
        io.emit('locationMessage', generateLocationMessage(url));
        callback();
    });

    socket.on('disconnect', () => {
        io.emit('message', generateMessage('A user has left'));
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
