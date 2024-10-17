const socket=io();
const chatform=document.getElementById("chat-form");
const chatmessages=document.querySelector(".chat-messages");
const roomName=document.getElementById("room-name");
const userList=document.getElementById("users")
// Getting username and room from URL using Qs library
const {username,room} = Qs.parse(location.search,{
    ignoreQueryPrefix:true
})

// Joining a chatroom
socket.emit("joinroom",{username,room});

// Getting room users info from server and showing it
socket.on("roomusers",({room ,users})=>{
    outputRoomName(room);
    outputUsers(users);
});

// Message From Server
socket.on("message",(message)=>{
    console.log(message);
    outputmsg(message);

    // automatic scroll down as message is printed
    chatmessages.scrollTop=chatmessages.scrollHeight;

});



// submitting a message
chatform.addEventListener("submit",(e)=>{
    // to prevent automatic submit to a file
    e.preventDefault();
    
    // extracting message from event e
    const msg=e.target.elements.msg.value;

    // Emitting a message to a server
    socket.emit("chatmsg",msg);

    // Clear input after a message is sent
    e.target.elements.msg.value="";
    e.target.elements.msg.value.focus();
});

// output message to dom(adding a new message to dom)
function outputmsg(message){
    const div=document.createElement("div");
    div.classList.add("message");
    div.innerHTML=`<p class="meta">${message.username}<span>${message.time}</span></p>
	<p class="text">
		${message.text}
	</p>`;
    document.querySelector(".chat-messages").appendChild(div);

}

// adding room name to dom
function outputRoomName(room){
   roomName.innerText=room;
}

// adding users list to DOM
function outputUsers(users){
    userList.innerHTML=`
    ${users.map(user=> `<li>${user.username}</li>`).join("")}
    `;
}