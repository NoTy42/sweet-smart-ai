const messages = document.getElementById("messages");
const input = document.getElementById("userInput");
const historyBox = document.getElementById("history");
const fileInput = document.getElementById("fileInput");

let chats = [];

// Add message
function addMessage(text, type){
    let div = document.createElement("div");
    if(text.includes("<") || text.includes("function") || text.includes("import") || text.includes("def")){
        div.className = "code";
    } else {
        div.className = type;
    }
    div.innerText = text;
    
    // Copy button
    if(type=="bot" || div.className=="code"){
        let copyBtn = document.createElement("button");
        copyBtn.innerText = "Copy";
        copyBtn.style.marginLeft = "10px";
        copyBtn.onclick = ()=> navigator.clipboard.writeText(text);
        div.appendChild(copyBtn);
    }
    
    messages.appendChild(div);
    messages.scrollTop = messages.scrollHeight;
}

// Send message
async function send(){
    let text = input.value;
    if(!text) return;
    addMessage(text,"user");
    input.value="";

    try {
        let res = await fetch("https://api.affiliateplus.xyz/api/chatbot?message="+encodeURIComponent(text)+"&botname=SweetSmartAI&ownername=Fida");
        let data = await res.json();
        addMessage(data.message,"bot");
    } catch(e){
        addMessage("Error connecting AI API","bot");
    }
}

// New Chat
function newChat(){
    messages.innerHTML="";
    let item = document.createElement("div");
    item.innerText="Chat "+(chats.length+1);
    item.onclick = ()=> messages.innerHTML=""; 
    historyBox.appendChild(item);
    chats.push([]);
}

// Generate Image + Download button
function generateImage(){
    let prompt = input.value;
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

        // Watermark
        ctx.font = "30px Arial";
        ctx.fillStyle = "rgba(255,255,255,0.7)";
        ctx.fillText("Sweet Smart AI", canvas.width-250, canvas.height-20);

        let finalImg = document.createElement("img");
        finalImg.src = canvas.toDataURL();
        finalImg.style.maxWidth="100%";

        // Download button
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

// File upload
fileInput.addEventListener("change", function(e){
    let file = e.target.files[0];
    if(!file) return;
    let reader = new FileReader();
    reader.onload = function(evt){
        addMessage(evt.target.result,"user");
    };
    reader.readAsText(file);
});
