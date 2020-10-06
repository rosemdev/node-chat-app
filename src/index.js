const express = require("express");
const path = require('path');
const http = require('http');
const socketio = require('socket.io');
const Filter = require('bad-words');

const app = express();
const server = http.createServer(app);
const io = socketio(server);


const port = process.env.PORT || 3000
const publicDir = path.join(__dirname, '../public');

//set static directory to serve
app.use(express.static(publicDir));


io.on('connection', (socket)=> {
    console.log('New web socket connection');

    socket.emit('message', 'Welcome!');
    socket.broadcast.emit('message', 'A new user has joined');

    socket.on('sendMessage', (message, callback) => {
        const filter = new Filter();

        if(filter.isProfane(message)) {
            return callback('Profanity is not allowed!')
        }

        io.emit('message', message);
        callback();
    });

    socket.on('sendLocation', ({lat, lon}, callback) => {
        io.emit('locationMessage', `https://google.com/maps?q=${lat},${lon}`);
        callback();
    });

    socket.on('disconnect', () => {
        io.emit('message', 'A user has left');
    });

});


app.get('/', (req, res) => {
    res.render('index');
})


server.listen(port, () => {
  console.log("Server is running on port " + port);
});
