const socket = io();
console.log(socket);

const roomsEl = document.querySelector('#rooms');

//Templates
const roomsTemplate = document.querySelector('#rooms-template').innerHTML;



socket.on('connect', () => {
    console.log(socket.connected); 
});

socket.on('getRoomsList', ({roomsList}) => {

    console.log(roomsList);
    

    const html = Mustache.render(roomsTemplate, {
        roomsList
    });

    roomsEl.innerHTML = html;
});


console.log('index.js');
