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
    console.log("📤 بعت الطلب للـ Backend...");
    const res = await fetch("/api/backend", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: message }]
      })
    });

    // Debug
    const text = await res.text();
    console.log("📥 الرد من الـ Backend:", text);

    removeLoader(loaderElement);

    let data;
    try {
      data = JSON.parse(text);
    } catch {
      return addMessage("ai", "حصل خطأ في الرد!");
    }

    const reply = data.choices?.[0]?.message?.content || "حصل خطأ!";
    addMessage("ai", reply);

  } catch (err) {
    removeLoader(loaderElement);
    addMessage("ai", "حصل خطأ في الاتصال!");
    console.error(err);
  }
}

function addMessage(sender, text) {
  const div = document.createElement("div");
  div.className = `message ${sender}`;

  const bubble = document.createElement("div");
  bubble.className = "bubble";
  bubble.textContent = text;

  div.appendChild(bubble);
  chatBox.appendChild(div);
  chatBox.scrollTop = chatBox.scrollHeight;
}

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