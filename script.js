function fetchResults(event) {
  event.preventDefault();
  const input = document.getElementById("text-input");
  const chat = input.value.trim();
  if (!chat) return;

  appendMessage(chat, "user");
  showTypingIndicator();
  fetchApiResponse(chat);
  input.value = "";
}

function formatTime() {
  const now = new Date();
  return now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function appendMessage(text, sender) {
  const container = document.getElementById("chat-container");
  const msgDiv = document.createElement("div");
  msgDiv.classList.add(
    "message",
    sender === "user" ? "user-message" : "ai-message"
  );

  if (text.includes("```")) {
    const formatted = text
      .split("```")
      .map((chunk, i) =>
        i % 2 === 0
          ? `<p>${chunk}</p>`
          : `<pre><code>${chunk.trim()}</code></pre>`
      )
      .join("");
    msgDiv.innerHTML = formatted;
  } else {
    msgDiv.innerText = text;
  }

  const timestamp = document.createElement("span");
  timestamp.className = "timestamp";
  timestamp.innerText = formatTime();
  msgDiv.appendChild(timestamp);

  container.appendChild(msgDiv);
  container.scrollTop = container.scrollHeight;
}

function showTypingIndicator() {
  const container = document.getElementById("chat-container");
  const typingDiv = document.createElement("div");
  typingDiv.classList.add("message", "ai-message");
  typingDiv.id = "typing";
  typingDiv.innerText = "Thinking...";
  container.appendChild(typingDiv);
  container.scrollTop = container.scrollHeight;
}

function removeTypingIndicator() {
  const typingDiv = document.getElementById("typing");
  if (typingDiv) typingDiv.remove();
}

async function fetchApiResponse(chat) {
  try {
    const resp = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=AIzaSyBoIBXIgJgEdOopnNDCiZd7xDQsOTIUG38",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [{ parts: [{ text: chat }] }],
        }),
      }
    );

    const data = await resp.json();
    removeTypingIndicator();

    const reply =
      data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "Sorry, something went wrong.";
    appendMessage(reply, "ai");
  } catch (err) {
    removeTypingIndicator();
    appendMessage("Oops! Network issue or invalid API key.", "ai");
    console.error(err);
  }
}

// 🌙 Dark Mode Toggle
document.getElementById("toggle-theme").addEventListener("click", () => {
  document.body.classList.toggle("dark");
  const btn = document.getElementById("toggle-theme");
  btn.textContent = document.body.classList.contains("dark") ? "☀️" : "🌙";
});
