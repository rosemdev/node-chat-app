const socket = io();
console.log(socket);

//Elements
const roomsEl = document.querySelector('#rooms');
const select = roomsEl.querySelector('select');
const newRoomBtn = document.querySelector('.new-room');
const newRoomForm = document.querySelector('.new-room-block');
const selectRoomBtn = document.querySelector('.select-room');
const joinBtn = document.querySelector('.join-block');

//Templates
const roomsTemplate = document.querySelector('#rooms-template').innerHTML;



socket.on('connect', () => {
    console.log(socket.connected);

    if(!select) { 
        selectRoomBtn.style.display = 'none'
    } else {
        selectRoomBtn.style.display = 'block'
    }
});

socket.on('getRoomsList', ({roomsList}) => {
    const html = Mustache.render(roomsTemplate, {
        roomsList
    });
    
    roomsEl.innerHTML = html;    
});

newRoomBtn.addEventListener('click', (event) => {  
    newRoomForm.style.display = 'block';
    joinBtn.style.display = 'block';
});

selectRoomBtn.addEventListener('click', (event) => {  
    
    let select = roomsEl.querySelector('select');
    roomsEl.style.display = 'block';
    joinBtn.style.display = 'block';
   
});
