const socket = io();

let form = document.querySelector('form');

socket.on('message', (message) => {
    console.log(message);
})

form.addEventListener('submit', (event) => {

    event.preventDefault();

    let message = event.target.elements.message.value;    

    if(!message) {
        return;
    }
 
    socket.emit('sendMessage', message, (error) => {

        if(error) {
            return console.error(error);
        }
         
        console.log('The message was delivered!');
        
    });
});


let sendLocationBtn = document.querySelector('#send-location');

sendLocationBtn.addEventListener('click', (event) => {
    if(!navigator.geolocation) {
        return alert('Please use modern browser!');
    }

    navigator.geolocation.getCurrentPosition((position) => {    

        socket.emit('sendLocation', 
        {
            lat: position.coords.latitude, 
            lon: position.coords.longitude
        }, () => {
            console.log('Location is shared');
            
        }
        
        );
        
    });
});


