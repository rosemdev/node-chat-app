const socket = io();
console.log(socket);

//Elements
const roomChoiceBlock = document.querySelector('.room-choice-block');

//new room
const newRoomBtn = document.querySelector('.new-room');
const newRoomForm = document.querySelector('.new-room-form');

//select room
const selectRoomBtn = document.querySelector('.select-room');
const selectRoomForm = document.querySelector('.existing-room-form');
const roomsListBlock = document.querySelector('#rooms');

//Templates
const roomsTemplate = document.querySelector('#rooms-template').innerHTML;

//Veriables
let availableRooms = [];


socket.on('connect', () => {
    console.log(socket.connected);
    showHideRoomChoice();

});

socket.on('getRoomsList', ({roomsList}) => {
    const html = Mustache.render(roomsTemplate, {
        roomsList
    });

    availableRooms = roomsList;
    roomsListBlock.innerHTML = html; 

    showHideRoomChoice();

    let roomSelect = document.querySelector('.rooms');
    
        roomSelect.addEventListener('change', function() {
            console.log('You selected: ', this.value);

            socket.emit('selectedRoom', {selectedRoom: this.value}, () => {
                console.log('selectedRoom is shared');  
            });
        });

});

//Event listeners

newRoomBtn.addEventListener('click', () => {

    //if selectRoomForm is visible then turn it off
    if(selectRoomForm.classList.contains('selected')) {
        selectRoomForm.classList.remove('selected');
        selectRoomForm.style.display = 'none';
    }

    newRoomForm.classList.add('selected');


    if(newRoomForm.classList.contains('selected')) {
        newRoomForm.style.display = 'block';
    }
    
});

selectRoomBtn.addEventListener('click', () => {
    
    //if newRoomForm is visible then turn it off
    if(newRoomForm.classList.contains('selected')) {
        newRoomForm.classList.remove('selected');
        newRoomForm.style.display = 'none';
    }
    
    selectRoomForm.classList.add('selected');

    if(selectRoomForm.classList.contains('selected')) {
        selectRoomForm.style.display = 'block';
    }    

});


//helper functions

function showHideRoomChoice() {
    if(availableRooms.length === 0) {
        roomChoiceBlock.style.display = 'none';
        newRoomForm.style.display = 'block';
    } else {
        roomChoiceBlock.style.display = 'block';
        newRoomForm.style.display = 'none';
    }  
}
