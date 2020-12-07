import { getCookie } from "./util.js";

const socket = io();
let messageContainer = document.querySelector("#ul-message-display-block");
let messageForm = document.querySelector("#message-send-block");
let messageInput = document.querySelector("#input-message-send-textarea");

// message from server
socket.on("lobby-chat-message", (data) => {
    appendMessage(data);
});

messageForm.addEventListener("submit", (e) => {
    e.preventDefault();
    let message = messageInput.value;
    let user_id = getCookie("user_id");
    let data = { user_id: user_id, message: message };
    appendMessage(data);
    socket.emit("lobby-send-chat-message", data);
    // reset the message input
    messageInput.value = "";
});

// Append message to DOM
function appendMessage(data) {
    const messageElement = document.createElement("li");
    messageElement.classList.add("li-message-display-item");
    messageElement.innerHTML = `<p class="message-display-user"> <strong>${data.user_id}: </strong>${data.message}</p>`;
    messageContainer.appendChild(messageElement);
    
    // Scroll down
    messageContainer.scrollTop = messageContainer.scrollHeight;

}
