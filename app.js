import { API_KEY } from "./config.js";

const messages = document.getElementById("messages");
const input = document.getElementById("userInput");

const sendBtn = document.getElementById("sendBtn");
const voiceBtn = document.getElementById("voiceBtn");
const imgBtn = document.getElementById("imgBtn");
const clearBtn = document.getElementById("clearBtn");
const themeBtn = document.getElementById("themeBtn");
const fileInput = document.getElementById("fileInput");

// Welcome voice
window.onload = () => {
    speechSynthesis.speak(new SpeechSynthesisUtterance("Welcome to Sweet Smart AI"));
};

// Send user message
sendBtn.onclick = sendMessage;

async function sendMessage() {
    const text = input.value.trim();
    if (!text) return;

    addMessage("user", text);
    input.value = "";

    const reply = await askAI(text);
    addMessage("ai", reply, true);
}

// Add message to chat window
function addMessage(role, text, voice = false) {
    const div = document.createElement("div");
    div.className = role === "user" ? "user" : "ai";

    const span = document.createElement("span");
    span.innerText = text;
    div.appendChild(span);

    if (role === "ai") {
        const copyBtn = document.createElement("button");
        copyBtn.innerText = "Copy";
        copyBtn.onclick = () => {
            navigator.clipboard.writeText(text);
            copyBtn.innerText = "Copied";
        };
        div.appendChild(copyBtn);
    }

    messages.appendChild(div);
    messages.scrollTop = messages.scrollHeight;

    if (voice) speechSynthesis.speak(new SpeechSynthesisUtterance(text));
}

// Gemini API call
async function askAI(prompt) {
    const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`,
        {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }]
            })
        }
    );
    const data = await res.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text || "No response";
}

// Voice input
voiceBtn.onclick = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const rec = new SpeechRecognition();
    rec.start();
    rec.onresult = e => {
        input.value = e.results[0][0].transcript;
    };
};

// Image generation
imgBtn.onclick = () => {
    const prompt = input.value;
    if (!prompt) return;
    addMessage("ai", "🖼 Image:\nhttps://image.pollinations.ai/prompt/" + encodeURIComponent(prompt));
};

// File reader
fileInput.onchange = e => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = () => {
        input.value = reader.result;
    };
    reader.readAsText(file);
};

// Clear chat
clearBtn.onclick = () => {
    messages.innerHTML = "";
};

// Toggle theme
themeBtn.onclick = () => {
    document.body.classList.toggle("light");
};
