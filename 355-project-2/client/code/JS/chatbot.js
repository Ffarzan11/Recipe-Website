const sendChatBtn = document.querySelector(".chat-input span");
const chatInput = document.querySelector(".chat-input textarea");
const chatBox = document.querySelector(".chatbox");

let userMessage;

async function generateResponse(incomingChatLi) {
  const messageElement = incomingChatLi.querySelector("p");
  try {
    const response = await fetch("/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        role: "user",
        userMessage: userMessage,
      }),
    });

    if (response.ok) {
      data = await response.json();
      const generatedText = data.responseText;
      messageElement.textContent = generatedText;
      incomingChatLi.appendChild(messageElement);
    }
  } catch (error) {
    console.error("Error in chat:", error);
  }
}

const createChatLi = (message, className) => {
  const chatLi = document.createElement("li");
  chatLi.classList.add("chat", className);
  let chatContent =
    className === "outgoing"
      ? `<p>${message}</p>`
      : `<span class="bot-icon"><i class="fa-solid fa-robot"></i></span><p>${message}</p>`;
  chatLi.innerHTML = chatContent;
  chatLi.querySelector("p").textContent = message;
  return chatLi;
};

const handleChat = () => {
  userMessage = chatInput.value.trim();
  if (!userMessage) return;

  chatInput.value = "";

  chatBox.appendChild(createChatLi(userMessage, "outgoing"));

  setTimeout(() => {
    const incomingChatLi = createChatLi("Thinking...", "incoming");
    chatBox.appendChild(incomingChatLi);
    generateResponse(incomingChatLi);
  }, 600);
};

sendChatBtn.addEventListener("click", handleChat);
