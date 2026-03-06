import { GoogleGenerativeAI } from "https://esm.sh/@google/generative-ai";

// 🛑 APNI API KEY YAHAN PASTE KREIN
export const API_KEY = AIzaSyBbwQyzp9pLEkCHO_8ODehSD3aXhZoMlMk
const genAI = new GoogleGenerativeAI(API_KEY);

const messagesDiv = document.getElementById('messages');
const userInput = document.getElementById('userInput');
const sendBtn = document.getElementById('sendBtn');

async function handleChat() {
    const text = userInput.value.trim();
    if (!text) return;

    appendMsg('user', text);
    userInput.value = '';

    const aiBubble = appendMsg('ai', 'Thinking...');

    // Image logic: "banao", "image", "photo" keywords par trigger hoga
    if (text.toLowerCase().includes("image") || text.toLowerCase().includes("banao")) {
        const imgUrl = `https://pollinations.ai/p/${encodeURIComponent(text)}?width=1024&height=1024&nologo=true`;
        aiBubble.innerHTML = `Creating image for: "${text}"...<br><img src="${imgUrl}" class="generated-image">`;
    } else {
        try {
            const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
            const result = await model.generateContent(text);
            const response = await result.response;
            aiBubble.innerText = response.text();
        } catch (e) {
            aiBubble.innerText = "Error: Check your API Key or Internet.";
        }
    }
}

function appendMsg(role, text) {
    const div = document.createElement('div');
    div.className = `message-box ${role}`;
    div.innerText = text;
    messagesDiv.appendChild(div);
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
    return div;
}

sendBtn.addEventListener('click', handleChat);
// Enter key se send karne ke liye
userInput.addEventListener('keypress', (e) => { if(e.key === 'Enter') handleChat(); });
// Icons load karne ke liye
lucide.createIcons();
