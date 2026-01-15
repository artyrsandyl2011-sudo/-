// -------------------------
// Змінні
// -------------------------
let balance=500, level=1, win=20, upgradeCost=200;
let totalGames=0,totalWins=0,totalLosses=0;
let rouletteGames=0, slotGames=0, diceGames=0, boxGames=0, bossGames=0;
let achievements=[];

const bgMusic = document.getElementById("bgMusic");
bgMusic.volume = 0.3;
document.addEventListener("click", () => { bgMusic.play(); }, {once:true});


// UI
const panels=document.querySelectorAll(".panel");
const gamePanels=document.querySelectorAll(".gamePanel");
const balanceSpan=document.getElementById("balance");
const levelSpan=document.getElementById("level");
const upgradeCostSpan=document.getElementById("upgradeCost");

// Звуки
const clickSound=document.getElementById("clickSound");
const winSound=document.getElementById("winSound");
const loseSound=document.getElementById("loseSound");
function playSound(type){
    if(type==="click") clickSound.play();
    if(type==="win") winSound.play();
    if(type==="lose") loseSound.play();
}

// -------------------------
// UI функції
// -------------------------
function hideAll(){ panels.forEach(p=>p.style.display="none"); gamePanels.forEach(p=>p.style.display="none"); }

function showPanel(id){ hideAll(); document.getElementById(id).style.display="block"; playSound("click"); }

function update(){
    balanceSpan.innerText=balance;
    levelSpan.innerText=level;
    upgradeCostSpan.innerText=upgradeCost;
    document.getElementById("slotGameBtn").disabled=level<2;
    document.getElementById("bossGameBtn").disabled=level<4 || balance<100000;
}

// -------------------------
// Меню кнопки
// -------------------------
document.getElementById("menuBtn").onclick=()=>showPanel("menu");
document.getElementById("statsBtn").onclick=()=>showStats();
document.getElementById("upgradeBtn").onclick=()=>showPanel("upgrade");

// -------------------------
// Кнопки ігор
// -------------------------
document.getElementById("rouletteGameBtn").onclick=()=>showPanel("roulettePanel");
document.getElementById("slotGameBtn").onclick=()=>showPanel("slotPanel");
document.getElementById("diceGameBtn").onclick=()=>showPanel("dicePanel");
document.getElementById("boxesGameBtn").onclick=()=>showPanel("boxesPanel");
document.getElementById("bossGameBtn").onclick=()=>showPanel("bossPanel");

// -------------------------
// Кнопки ігор
// -------------------------
document.getElementById("redBtn").onclick=()=>roulettePlay("червоний");
document.getElementById("blackBtn").onclick=()=>roulettePlay("чорний");
document.getElementById("whiteBtn").onclick=()=>roulettePlay("білий");

document.getElementById("spinSlotBtn").onclick=()=>slotGame();
document.getElementById("rollDiceBtn").onclick=()=>diceGame();
document.getElementById("box1Btn").onclick=()=>chooseBox(1);
document.getElementById("box2Btn").onclick=()=>chooseBox(2);
document.getElementById("box3Btn").onclick=()=>chooseBox(3);
document.getElementById("boss1Btn").onclick=()=>bossChoice(1);
document.getElementById("boss2Btn").onclick=()=>bossChoice(2);
document.getElementById("boss3Btn").onclick=()=>bossChoice(3);
document.getElementById("boss4Btn").onclick=()=>bossChoice(4);
document.getElementById("boss5Btn").onclick=()=>bossChoice(5);
document.getElementById("upgradeBtnDo").onclick=()=>upgrade();

// -------------------------
// Частинки космосу
// -------------------------
const canvas=document.getElementById("particles");
const ctx=canvas.getContext("2d");
let parts=[];
function resize(){ canvas.width=innerWidth; canvas.height=innerHeight; }
resize(); window.addEventListener("resize",resize);
for(let i=0;i<80;i++) parts.push({x:Math.random()*canvas.width,y:Math.random()*canvas.height,r:Math.random()*2+1,vx:(Math.random()-0.5)*0.4,vy:(Math.random()-0.5)*0.4,color:"white"});
function animate(){
    ctx.clearRect(0,0,canvas.width,canvas.height);
    parts.forEach(p=>{
        p.x+=p.vx; p.y+=p.vy;
        if(p.x<0||p.x>canvas.width)p.vx*=-1;
        if(p.y<0||p.y>canvas.height)p.vy*=-1;
        ctx.beginPath(); ctx.fillStyle=p.color; ctx.arc(p.x,p.y,p.r,0,Math.PI*2); ctx.fill();
    });
    requestAnimationFrame(animate);
}
animate();

// -------------------------
// Вибух частинок при виграші
// -------------------------
function fireworks(color="gold"){
    for(let i=0;i<40;i++){
        parts.push({
            x:Math.random()*canvas.width,
            y:Math.random()*canvas.height,
            r:2+Math.random()*2,
            vx:(Math.random()-0.5)*6,
            vy:(Math.random()-0.5)*6,
            color:color
        });
    }
    setTimeout(()=>parts.splice(80),1000);
}

// -------------------------
// Гри
// -------------------------
function roulettePlay(c){
    if(balance<10){ alert("Недостатньо грошей"); return;}
    totalGames++; rouletteGames++; balance-=10;
    let colors=["червоний","чорний","білий"];
    let r=colors[Math.floor(Math.random()*3)];
    if(c===r){ balance+=win; totalWins+=win; playSound("win"); fireworks(r==="червоний"?"red":r==="чорний"?"black":"white"); } 
    else playSound("lose");
    update();
}

function slotGame(){
    if(balance<10){ alert("Недостатньо грошей"); return;}
    totalGames++; slotGames++; balance-=10;
    let s=["7️⃣","☠️","😼","⭐","💍"];
    let a=s[Math.floor(Math.random()*5)];
    let b=s[Math.floor(Math.random()*5)];
    let c=s[Math.floor(Math.random()*5)];
    document.getElementById("slotSymbols").innerHTML=`<span class="symbol">${a}</span><span class="symbol">${b}</span><span class="symbol">${c}</span>`;
    let gain=0;
    if(a===b && b===c){
        if(a==="7️⃣") gain=2500;
        if(a==="☠️") gain=-250;
        if(a==="😼") gain=30;
        if(a==="⭐") gain=100;
        if(a==="💍") gain=300;
        balance+=gain;
        if(gain>0){ totalWins+=gain; playSound("win"); fireworks("gold"); } 
        else { totalLosses+=Math.abs(gain); playSound("lose"); }
    }
    update();
}

function diceGame(){
    if(balance<50){ alert("Недостатньо грошей"); return;}
    totalGames++; diceGames++; balance-=50;
    let a=Math.floor(Math.random()*6)+1;
    let b=Math.floor(Math.random()*6)+1;
    document.getElementById("diceAnim").innerText=`🎲 ${a}+${b}`;
    if(a+b>=8){ balance+=100; totalWins+=100; playSound("win"); fireworks("cyan"); } 
    else playSound("lose");
    update();
}

function chooseBox(n){
    if(balance<10){ alert("Недостатньо грошей"); return;}
    totalGames++; boxGames++; balance-=10;
    let winBox=Math.floor(Math.random()*3)+1;
    if(n===winBox){ balance+=30; totalWins+=30; playSound("win"); fireworks("pink"); } 
    else playSound("lose");
    update();
}

function bossChoice(n){
    if(balance<100000){ alert("Потрібно 100000"); return;}
    totalGames++; bossGames++;
    let r=Math.floor(Math.random()*5)+1;
    if(n===r){ win=3000; alert("🔥 Новий рівень прокачки!"); playSound("win"); fireworks("gold"); } 
    else { win=20; level=1; alert("💀 Програш"); playSound("lose"); }
    update();
}

// -------------------------
// Прокачка
// -------------------------
function upgrade(){
    if(balance<upgradeCost){ alert("Недостатньо грошей"); return;}
    balance-=upgradeCost; level++; win+=10; upgradeCost+=200;
    playSound("win"); fireworks("lime");
    update();
}

// -------------------------
// Статистика
// -------------------------
function showStats(){
    hideAll();
    document.getElementById("stats").style.display="block";
    document.getElementById("sGames").innerText=totalGames;
    document.getElementById("sWins").innerText=totalWins;
    document.getElementById("sLoss").innerText=totalLosses;
    document.getElementById("sRoulette").innerText=rouletteGames;
    document.getElementById("sSlots").innerText=slotGames;
    document.getElementById("sDice").innerText=diceGames;
    document.getElementById("sBoxes").innerText=boxGames;
    document.getElementById("sBoss").innerText=bossGames;
}

// -------------------------
// Старт
// -------------------------
update();
showPanel("menu");
