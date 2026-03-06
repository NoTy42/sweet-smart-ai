import { GoogleGenerativeAI } from "https://esm.sh/@google/generative-ai";

// ✅ Aapki API Key yahan Quotes ke andar set kar di gayi hai
const API_KEY = "AIzaSyBbwQyzp9pLEkCHO_8ODehSD3aXhZoMlMkaXhZoMlMk";
const genAI = new GoogleGenerativeAI(API_KEY);
let chatHistory = [];

const messagesDiv = document.getElementById('messages');
const userInput = document.getElementById('userInput');
const sendBtn = document.getElementById('sendBtn');

async function handleChat() {
    const text = userInput.value.trim();
    if (!text) return;

    // 1. User Message Display
    appendMsg('user', text);
    userInput.value = '';
    userInput.style.height = 'auto';

    // 2. AI Placeholder
    const aiBubble = appendMsg('ai', 'Thinking...');

    // 3. Image Generation Logic
    if (text.toLowerCase().includes("image") || text.toLowerCase().includes("photo") || text.toLowerCase().includes("banao")) {
        const imgUrl = `https://pollinations.ai/p/${encodeURIComponent(text)}?width=1024&height=1024&nologo=true`;
        aiBubble.innerHTML = `Generating image for you...<br><img src="${imgUrl}" class="generated-image" style="width:100%; border-radius:12px; margin-top:10px;" onload="messagesDiv.scrollTop = messagesDiv.scrollHeight">`;
    } else {
        // 4. Gemini AI Text/Code Response
        try {
            const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
            const chat = model.startChat({ history: chatHistory });
            const result = await chat.sendMessage(prompt);
            const responseText = result.response.text();
            
            // Save to memory
            chatHistory.push({ role: "user", parts: [{ text: text }] });
            chatHistory.push({ role: "model", parts: [{ text: responseText }] });

            // Stream text like ChatGPT
            streamText(aiBubble, responseText);
        } catch (e) {
            aiBubble.innerText = "System Error: Please check if the API key is active or try again later.";
            console.error(e);
        }
    }
}

function appendMsg(role, text) {
    const div = document.createElement('div');
    div.className = `message-box ${role}`;
    div.innerHTML = `<div class="content-bubble">${text}</div>`;
    messagesDiv.appendChild(div);
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
    return div.querySelector('.content-bubble');
}

function streamText(element, text) {
    element.innerHTML = '';
    let i = 0;
    const interval = setInterval(() => {
        if (i < text.length) {
            element.innerHTML += text.charAt(i);
            i++;
            messagesDiv.scrollTop = messagesDiv.scrollHeight;
        } else { clearInterval(interval); }
    }, 15);
}

// Click and Enter key support
sendBtn.addEventListener('click', handleChat);
userInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleChat();
    }
});

// Initialize Icons
if (window.lucide) { lucide.createIcons(); } 
