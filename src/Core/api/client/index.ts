import { io, Socket } from "socket.io-client";

const form: HTMLElement | null = document.getElementById("form");
const usernameInput: HTMLInputElement | null = document.getElementById(
  "username"
) as HTMLInputElement;
const joinBtn: HTMLButtonElement | null = document.getElementById(
  "joinBtn"
) as HTMLButtonElement;
const container: HTMLElement | null = document.getElementById("container");
const messageInput: HTMLInputElement | null = document.getElementById(
  "message"
) as HTMLInputElement;
const sendBtn: HTMLButtonElement | null = document.getElementById(
  "sendBtn"
) as HTMLButtonElement;
const messageList: HTMLUListElement | null = document.getElementById(
  "messageList"
) as HTMLUListElement;
const typingText: HTMLElement | null = document.getElementById("typing");

const audio = new Audio("effect.mp3");
const socket: Socket = io("http://localhost:8080");

let typingTimeout: NodeJS.Timeout | null = null;
let previousMessage: string = "";

socket.on("connect", () => {
  console.log("Connected to server");
});

socket.on(
  "receive-message",
  ({ username, message }: { username: string; message: string }) => {
    if (typingText) typingText.textContent = "";

    console.log(`[${username}]: ${message}`);

    if (username !== usernameInput?.value) audio.play();

    const messageItem = document.createElement("li");
    messageItem.textContent = `[${username}]: ${message}`;
    messageList?.appendChild(messageItem);
  }
);

joinBtn?.addEventListener("click", () => {
  if (usernameInput?.value) {
    if (container) container.style.display = "block";
    if (form) form.style.display = "none";
  }
});

sendBtn?.addEventListener("click", () => {
  sendMessage();
});

messageInput?.addEventListener("keypress", () => {
  socket.emit("type", usernameInput?.value);
  startTypingTimeout();
});

messageInput?.addEventListener("keyup", (e: KeyboardEvent) => {
  if (e.key === "Enter") {
    sendMessage();
  }
});

socket.on("typing-user", (username: string) => {
  if (typingText) typingText.textContent = `${username} is typing...`;
  console.log(`${username} is typing...`);
});

socket.on("stopped-typing", () => {
  if (typingText) typingText.textContent = "";
});

// Mesajı göndərən funksiya
function sendMessage(): void {
  if (messageInput && messageInput.value.trim() !== "") {
    socket.emit("chat", {
      username: usernameInput?.value,
      message: messageInput.value,
    });
    messageInput.value = "";
  }
}

// 2 saniyədən bir input dəyərini yoxlayan funksiya
setInterval(() => {
  if (messageInput) {
    if (previousMessage !== messageInput.value && messageInput.value !== "") {
      previousMessage = messageInput.value;
    } else if (messageInput.value === previousMessage) {
      socket.emit("stopped-typing");
    }
  }
}, 2000);

// Typing dayandırmaq üçün taymer
function startTypingTimeout(): void {
  if (typingTimeout) clearTimeout(typingTimeout);

  typingTimeout = setTimeout(() => {
    if (messageInput && messageInput.value === "") {
      socket.emit("stopped-typing");
    }
  }, 5000);
}
