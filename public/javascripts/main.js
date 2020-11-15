// Elements for chatting functions
const chatForm = document.getElementById('chat-form');
const chatMessages = document.querySelector('.chat-messages');
const roomName = document.getElementById('room-name');
const userList = document.getElementById('users');

// Elements for streaming functions
const videoGrid = document.getElementById('video-grid');
const myVideo = document.createElement('video');
const peersList = {};

// Get username and room from URL by parsing window.location
// location.search only get query string
const { username, room } = Qs.parse(location.search, {
    // ignore '?', '=' and '&' symbols
    ignoreQueryPrefix: true,
});

// Debugging: log on the client side
// console.log(username, room);

const socket = io('/');

// Establishing the Peer
// the first parameter is the ID, we set it to undefined
// let server take care of generating it
const myPeer = new Peer(undefined, {
    host: '/',
    port: '3001',
    secure: true,
    path: '/peerjs'
});

// Join chatroom
// with peer, pass the generated id(userId) to the server
myPeer.on('open', id => {
    socket.emit('joinRoom', { username, room }, id);
});

// Streaming settings
// mute ourself, so we don't have to hear our own microphone play back to us
myVideo.muted = true;
// searching keyword: 'promise'
// it's going go pass a stream(our video and audio)
navigator.mediaDevices.getUserMedia({
    // options
    video: true,
    audio: true
}).then(stream => {
    addVideoStream(myVideo, stream)

    // listen to someone tries to call us
    myPeer.on('call', call => {
        // answer the call from our one peer
        call.answer(stream);
        // respond to video stream that come in
        const video = document.createElement('video');
        call.on('stream', userVideoStream => {
            addVideoStream(video, userVideoStream);
        });
    });

    // listening to the server, as a new user join the room, the server will pass the userId to client
    socket.on('user-connected', userId => {
        // Debugging: log on the client side
        // console.log('User connected: ' + userId);
        
        // to send the video to the user we're trying to connect to.
        connectToNewUser(userId, stream)
    });
});

// 
socket.on('user-disconnected', userId => {
    // Debugging: log on the client side
    // console.log('User disconnected: ' + userId);
    
    // remove the video call of the user who disconnected
    if(peersList[userId]) {
        peersList[userId].close();
    }
});

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
    
    // Debugging: log on the client side
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
    // join('') turning array into string, or you will see ',' between user names on the page
    userList.innerHTML = `
        ${users.map(user => `<li>${user.username}</li>`).join('')}
    `;
};

// Make calls when new users connect to our room
function connectToNewUser(userId, stream) {
    // call(): call a user that we give a certain ID
    // calling the user with this ID and sending them our video and audio stream
    const call = myPeer.call(userId, stream);
    const recived_video = document.createElement('video');
    // listen to the event whem they send us back their stream
    // taking the stream from the other user we are calling and adding it to our own 'recived_video' element
    call.on('stream', userVideoStream => {
        addVideoStream(recived_video, userVideoStream);
    });
    // when someone leave the video call, so we need to remove their video
    call.on('close', () => {
        recived_video.remove();
    });

    //  let every user id directly link to the call that we make
    peersList[userId] = call;
};

// Add streaming video on the page
function addVideoStream(video, stream) {
    // this will allow us to play the video
    video.srcObject = stream;
    // add an event listener to the video
    // once the stream and video actually is loaded on the page, play the video 
    video.addEventListener('loadedmetadata', () => {
        video.play();
    })
    // append the video the the html element
    videoGrid.append(video);
};