const socket = io();


//Elements
const messageForm = document.querySelector('form');
const messageFormInput = messageForm.querySelector('#message');
const messageFormButton = messageForm.querySelector('button');
const sendLocationButton = document.querySelector('#send-location');
const messages = document.querySelector('#messages');
const locationMessage = document.querySelector('#locations');

//Templates
const messageTemplate = document.querySelector('#message-template').innerHTML;
const locationTemplate = document.querySelector('#location-template').innerHTML;


socket.on('message', (message) => {
    console.log(message);
    const html = Mustache.render(messageTemplate, {
        message
    });
    messages.insertAdjacentHTML('beforeend', html)

});

socket.on('locationMessage', (url)=> {
    const html = Mustache.render(locationTemplate, {
        url
    });    
    locationMessage.insertAdjacentHTML('beforeend', html);
    
});

messageForm.addEventListener('submit', (event) => {

    event.preventDefault();

    //disable form when it's been submited   
    messageFormButton.setAttribute('disabled', 'disabled');
    

    let message = event.target.elements.message.value;
 
    socket.emit('sendMessage', message, (error) => {
        //enable the form
        messageFormButton.removeAttribute('disabled');
        messageFormInput.value = '';
        messageFormInput.focus();

        if(error) {
            return console.error(error);
        }
         
        console.log('The message was delivered!');
        
    });
});



sendLocationButton.addEventListener('click', (event) => {
    if(!navigator.geolocation) {
        return alert('Please use modern browser!');
    }

    //disable button
    sendLocationButton.setAttribute('disabled', 'disabled');

    navigator.geolocation.getCurrentPosition((position) => {    

        socket.emit('sendLocation', 
        {
            lat: position.coords.latitude, 
            lon: position.coords.longitude
        }, () => {
            console.log('Location is shared');
            sendLocationButton.removeAttribute('disabled');
            
        }
        
        );
        
    });
});


