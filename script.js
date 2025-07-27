const chatBox = document.getElementById("chat-box");
const userInput = document.getElementById("user-input");
const sendBtn = document.getElementById("send-btn");

sendBtn.addEventListener("click", sendMessage);
userInput.addEventListener("keypress", e => {
  if (e.key === "Enter") sendMessage();
});

async function sendMessage() {
  const message = userInput.value.trim();
  if (!message) return;

  addMessage("user", message);
  userInput.value = "";

  // Loader
  const loaderElement = addLoader();

  try {
    const res = await fetch("/api/backend", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: message }]
      })
    });

    const text = await res.text();
    removeLoader(loaderElement);

    let data;
    try {
      data = JSON.parse(text);
    } catch {
      return addMessage("ai", "حصل خطأ في الرد!");
    }

    const reply = data.choices?.[0]?.message?.content || "حصل خطأ!";
    addTypingMessage("ai", reply);

  } catch (err) {
    removeLoader(loaderElement);
    addMessage("ai", "حصل خطأ في الاتصال!");
    console.error(err);
  }
}

function addMessage(sender, text) {
  const div = document.createElement("div");
  div.className = `message ${sender}`;

  // أيقونة من Font Awesome
  const icon = document.createElement("div");
  icon.className = "icon";
  icon.innerHTML = sender === "user"
    ? '<i class="fa-solid fa-user"></i>'
    : '<i class="fa-solid fa-robot"></i>';

  // الفقاعة
  const bubble = document.createElement("div");
  bubble.className = "bubble";
  bubble.textContent = text;

  // ترتيب RTL: المستخدم على اليمين، AI على الشمال
  if (sender === "user") {
    div.appendChild(icon);
    div.appendChild(bubble);
  } else {
    div.appendChild(bubble);
    div.appendChild(icon);
  }

  chatBox.appendChild(div);
  chatBox.scrollTop = chatBox.scrollHeight;
}

/* Typing Effect */
function addTypingMessage(sender, fullText) {
  const div = document.createElement("div");
  div.className = `message ${sender}`;

  const bubble = document.createElement("div");
  bubble.className = "bubble";
  div.appendChild(bubble);
  chatBox.appendChild(div);

  let index = 0;
  function typeChar() {
    if (index < fullText.length) {
      bubble.textContent += fullText.charAt(index);
      index++;
      chatBox.scrollTop = chatBox.scrollHeight;
      setTimeout(typeChar, 30);
    }
  }
  typeChar();
}

/* Loader */
function addLoader() {
  const div = document.createElement("div");
  div.className = "message ai loader-container";

  const bubble = document.createElement("div");
  bubble.className = "bubble";

  const loader = document.createElement("div");
  loader.className = "loader";
  loader.innerHTML = "<span></span><span></span><span></span>";

  bubble.appendChild(loader);
  div.appendChild(bubble);
  chatBox.appendChild(div);
  chatBox.scrollTop = chatBox.scrollHeight;

  return div;
}

function removeLoader(loaderElement) {
  chatBox.removeChild(loaderElement);
}

/* Clear Chat */
const clearBtn = document.getElementById("clear-chat");
clearBtn.addEventListener("click", () => {
  chatBox.innerHTML = "";
  localStorage.removeItem("chat-history");
});