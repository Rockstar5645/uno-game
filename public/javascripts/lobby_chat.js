import { getCookie } from "./util.js";

const socket = io();
let messageContainer = document.querySelector("#ul-message-display-block");
let messageForm = document.querySelector("#message-send-block");
let messageInput = document.querySelector("#input-message-send-textarea");

// message from server
socket.on("lobby-chat-message", (data) => {
    console.log(`Broadcast ${data}`);

    // broadcast to all users
    appendMessage(data, "left");
});

messageForm.addEventListener("submit", (e) => {
    e.preventDefault();
    let message = messageInput.value;
    let user_id = getCookie("user_id");
    let username = getCookie("username");
    let avatar = getCookie("avatar");
    let data = {
        user_id: user_id,
        username: username,
        avatar: avatar,
        message: message,
    };
    // Append to current user
    appendMessage(data, "right");
    socket.emit("lobby-send-chat-message", data);
    // reset the message input
    messageInput.value = "";
});

// Append message to DOM
function appendMessage(data, position) {
    let messageElement = messageElementLi(data, position);
    messageContainer.appendChild(messageElement);

    // Scroll down
    messageContainer.scrollTop = messageContainer.scrollHeight;
}

// Add HTML element for new message
function messageElementLi(data, position) {
    let messageElement = document.createElement("li");
    messageElement.classList.add("li-message-display-item");
    messageElement.classList.add(`li-message-${position}`);
    let msgEle = `
        <div class="message-display-user-name-message message-user-name-message-${position}"> 
            <p class="message-display-user-name message-user-name-${position}">${data.username}</p>
            <div class="message-display-user-message-block message-user-message-block-${position}">
                <p class="message-display-user-message message-user-message-${position}"> ${data.message}</p>
            </div>
        </div>
    `;
    let userEle = `
        <div class="message-display-user-avatar message-avatar-${position}">
            <img src=${data.avatar} alt="" class="message-display-user-avatar-img message-display-user-avatar-img-${position}"/>
        </div>
    `;
    // Add message on the right side for current user
    // Add message on the left side for all other users
    messageElement.innerHTML =
        position == "right"
            ? msgEle + userEle
            : userEle + msgEle;

    return messageElement;
}
