const chatForm = document.getElementById('chat-form');
const chatMessages = document.querySelector('.chat-messages');
const roomName = document.getElementById('room-name');
const userList = document.getElementById('users');


// Get username and room from URL by parsing window.location
// location.search only get query string
const { username, room } = Qs.parse(location.search, {
    // ignore '?', '=' and '&' symbols
    ignoreQueryPrefix: true,
});

// debugging: log on the client side
// console.log(username, room);

const socket = io();

// Join chatroom
socket.emit('joinRoom', { username, room });

// Get room and users
socket.on('roomUsers', ({ room, users }) => {
    outputRoomName(room);
    outputUsers(users);
});

// Catch the message sent from the server 
// at the beginning of the connection, the server will emit a message
// and it will be output
socket.on('message', message => {
    console.log(message);
    // output(pass) the message to DOM
    outputMessage(message);

    // scroll down to the bottom automatically when a new message is received or sent
    // BUG: Uncaught TypeError: Cannot read property 'scrollHeight' of null
    // ANS: Check if the class the chatMessages selected is right
    chatMessages.scrollTop = chatMessages.scrollHeight;
});

// Massage submit
chatForm.addEventListener('submit', (event) => {
    // when you submit a form, it will automatically submit to a file.
    // we want to prevent this from happening
    event.preventDefault();
    
    // grab the text input(message). you can grab it from DOM, or this way...
    // 'msg' in the tail is the id of the element. we just grab its value
    const msg = event.target.elements.msg.value;
    
    // debugging: log on the client side
    // console.log(msg);

    // emit the message to payload(to server)
    socket.emit('chatMessage', msg);

    // clear the input box
    event.target.elements.msg.value = '';
    event.target.elements.msg.focus();
});

// Output(pass) the message to DOM
function outputMessage(message) {
    // add a div elements
    const div = document.createElement('div');
    // add class 'message' to it
    div.classList.add('message');
    // add inner html to it
    div.innerHTML = `<p class="meta">${message.username} <span>${message.time}</span></p>
    <p class="text">
        ${message.text}
    </p>`;
    // use 'querySelector' to select the class(instead of using 'getElementById')
    // then append the div we created to it
    chatMessages.appendChild(div);
};

// Add room name to DOM
function outputRoomName(room) {
    roomName.innerText = room;
};

// Add users to DOM
function outputUsers(users) {
    // join('') turning array into string
    userList.innerHTML = `
        ${users.map(user => `<li>${user.username}</li>`).join('')}
    `;
};