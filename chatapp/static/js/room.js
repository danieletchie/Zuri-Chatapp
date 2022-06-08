console.log("Loadded Javascript")
const roomName = JSON.parse(document.getElementById("room-name").textContent);
let url = `wss://${window.location.host}/ws/chat/${roomName}/`;
const chatSocket = new WebSocket(url);
let classname = "";

const timeout = 1800 * 1000;
let auotLogout = setTimeout(logout, timeout);
const messagesDiv = document.getElementById("messages");

const user = `${Math.random().toString(36).substr(2, 9)}`;

const displayMessage = (user_data) => {
  htmlMessage = `
            <div class="${user_data.classname} pb-4">
                <div>
                  <img
                    src="https://cdn.icon-icons.com/icons2/1378/PNG/512/avatardefault_92824.png"
                    class="rounded-circle mr-1"
                    alt="Chris Wood"
                    width="40"
                    height="40"
                  />
                  <div class="text-muted small text-nowrap mt-2">
                    ${user_data.time}
                  </div>
                </div>
                <div class="flex-shrink-1 bg-light rounded py-2 px-3 mr-3">
                  <div class="font-weight-bold mb-1">${user_data.sender}</div>
                  ${user_data.message}
                </div>
              </div>
            `;

  messagesDiv.insertAdjacentHTML("beforeend", htmlMessage);
};

window.onload = (e) => {
  chatHistory = JSON.parse(window.localStorage.getItem(roomName));
  usernameDiv = document.getElementById("username");
  usernameDiv.innerHTML = user;
  for (let chat in chatHistory) {
    displayMessage(chatHistory[chat]);
  }
  messagesDiv.scrollTop = messagesDiv.scrollHeight;
};

chatSocket.onmessage = (e) => {
  const data = JSON.parse(e.data);
  sender = data.sender;
  message = data.message;
  let time = new Date();
  time = `${time.getHours()}:${time.getMinutes()}`;
  if (sender === user) {
    classname = "chat-message-right";
    sender = "You";
  } else {
    classname = "chat-message-left";
  }
  user_data = {
    classname,
    sender,
    message,
    time,
  };
  displayMessage(user_data);

  let messages = "";
  chatHistory = JSON.parse(window.localStorage.getItem(roomName));
  if (chatHistory) {
    messages = [...chatHistory, user_data];
  } else {
    messages = [user_data];
  }
  window.localStorage.setItem(roomName, JSON.stringify(messages));

  messagesDiv.scrollTop = messagesDiv.scrollHeight;
};

const form = document.getElementById("form");
form.addEventListener("submit", (e) => {
  e.preventDefault();
  const message = e.target.message.value;
  chatSocket.send(
    JSON.stringify({
      message: message,
      name: user,
    })
  );
  form.reset();
  clearTimeout(auotLogout);
  auotLogout = setTimeout(logout, timeout);
});

logout = () => {
  window.localStorage.removeItem(roomName);
  window.location.pathname = "/";
};

document.getElementById("logout").onclick = logout;
