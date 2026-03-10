const messages = document.getElementById("messages");
const input = document.getElementById("userInput");

function addMessage(text, type){
    let div = document.createElement("div");
    div.className = type;
    div.innerText = text;
    messages.appendChild(div);
    messages.scrollTop = messages.scrollHeight;
}

async function send(){
    let text = input.value.trim();
    if(!text) return;
    addMessage(text,"user");
    input.value = "";

    try {
        const res = await fetch("https://YOUR_BACKEND_URL/chat", {  // <-- replace with deployed backend URL
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ prompt: text })
        });
        const data = await res.json();
        addMessage(data.reply,"bot");
    } catch(e){
        addMessage("Error connecting backend","bot");
        console.error(e);
    }
}

function generateImage(){
    let prompt = input.value.trim();
    if(!prompt) return;

    let img = document.createElement("img");
    img.crossOrigin = "anonymous";
    img.src = "https://image.pollinations.ai/prompt/"+encodeURIComponent(prompt);

    img.onload = ()=>{
        let canvas = document.createElement("canvas");
        let ctx = canvas.getContext("2d");
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img,0,0);
        ctx.font = "30px Arial";
        ctx.fillStyle = "rgba(255,255,255,0.7)";
        ctx.fillText("Sweet Smart AI", canvas.width-250, canvas.height-20);

        let finalImg = document.createElement("img");
        finalImg.src = canvas.toDataURL();
        finalImg.style.maxWidth="100%";

        let downloadBtn = document.createElement("button");
        downloadBtn.innerText = "Download Image";
        downloadBtn.onclick = ()=>{
            let a = document.createElement("a");
            a.href = finalImg.src;
            a.download = "SweetSmartAI_Image.png";
            a.click();
        };
        downloadBtn.style.marginBottom = "10px";

        messages.appendChild(finalImg);
        messages.appendChild(downloadBtn);
        messages.scrollTop = messages.scrollHeight;
    }
              }
