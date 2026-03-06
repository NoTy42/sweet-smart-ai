import { GoogleGenerativeAI } from "https://esm.sh/@google/generative-ai";

// 🛑 APNI NAYI KEY YAHAN DALEIN
const API_KEY = "AIzaSyBbwQyzp9pLEkCHO_8ODehSD3aXhZoMlMkaXhZoMlMk"; 
const genAI = new GoogleGenerativeAI(API_KEY);
let chatHistory = [];

const messagesDiv = document.getElementById('messages');
const userInput = document.getElementById('userInput');
const sendBtn = document.getElementById('sendBtn');

async function handleChat() {
    const text = userInput.value.trim();
    if (!text) return;

    appendMsg('user', text);
    userInput.value = '';

    const aiBubble = appendMsg('ai', 'Thinking...');

    if (text.toLowerCase().includes("image") || text.toLowerCase().includes("banao")) {
        const imgUrl = `https://pollinations.ai/p/${encodeURIComponent(text)}?width=1024&height=1024&nologo=true`;
        aiBubble.innerHTML = `Generating image...<br><img src="${imgUrl}" class="generated-image" style="width:100%; border-radius:12px; margin-top:10px;" onload="messagesDiv.scrollTop = messagesDiv.scrollHeight">`;
    } else {
        try {
            // ✅ Version 1 Stable Model Use Kar Rahay Hain
            const model = genAI.getGenerativeModel({ 
                model: "gemini-1.5-flash",
                apiVersion: "v1" 
            }); 
            
            const result = await model.generateContent(text);
            const responseText = result.response.text();

            streamText(aiBubble, responseText);
        } catch (e) {
            // Detailed Error for debugging
            aiBubble.innerText = "Connection Error: " + e.message;
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

sendBtn.addEventListener('click', handleChat);
userInput.addEventListener('keypress', (e) => { if(e.key === 'Enter') handleChat(); });
if (window.lucide) { lucide.createIcons(); }
