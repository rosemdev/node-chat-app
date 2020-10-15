const socket = io();
socket.on('connect_error', function(err) {
    console.error(err);
    alert('Sory! Unable to connect. Try again.');
    location.href = '/';
});
 


//Elements
const messageForm = document.querySelector('form');
const messageFormInput = messageForm.querySelector('#message');
const messageFormButton = messageForm.querySelector('button');
const sendLocationButton = document.querySelector('#send-location');
const messages = document.querySelector('#messages');
const sidebar = document.querySelector('#sidebar');

//Templates
const messageTemplate = document.querySelector('#message-template').innerHTML;
const locationTemplate = document.querySelector('#location-template').innerHTML;
const sidebarTemplate = document.querySelector('#sidebar-template').innerHTML;

//Options
const {username, room} = Qs.parse(location.search, {ignoreQueryPrefix: true});

const autoscroll = () => {
    //New message el
    const newMessage = messages.lastElementChild;

    //Height of the last message
    const newMessageStyles = getComputedStyle(newMessage);
    const newMessageMargin = parseInt(newMessageStyles.marginBottom);
    const newMessageHeight = newMessage.offsetHeight + newMessageMargin;

    //Visible height
    const visibleHeight = messages.offsetHeight;

    //Height of messages container
    const containerHeight = messages.scrollHeight;

    //How far have I scrolled?
    const scrollOffset = messages.scrollTop + visibleHeight;

    if(containerHeight - newMessageHeight <= scrollOffset) {
        messages.scrollTop = messages.scrollHeight;
    }    
    
}

socket.on('message', (message) => {

    const html = Mustache.render(messageTemplate, {
        username: message.username,
        message: message.text,
        createdAt: moment(message.createdAt).format('HH:mm'),
    });
    messages.insertAdjacentHTML('beforeend', html);
    autoscroll();

});



socket.on('locationMessage', (location)=> {
    const html = Mustache.render(locationTemplate, {
        username: location.username,
        url: location.url,
        createdAt: moment(location.createdAt).format('HH:mm')
    });    
    messages.insertAdjacentHTML('beforeend', html);
    autoscroll();
    
});

socket.on('roomData', ({room, users}) => {
    const html = Mustache.render(sidebarTemplate, {
        room,
        users 
    });

    sidebar.innerHTML = html;
    
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
            alert(error);
            location.href = '/';
        }

        messages.lastElementChild.classList.add('right');
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

socket.emit('join', {username, room}, (error) => {
    
    if(error) {
        alert(error);
        location.href = '/';
    }
});


