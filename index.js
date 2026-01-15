// Базові змінні
let balance = 500;
let totalWins = 0;
let totalLosses = 0;
let level = 1;

// Оновлення балансу
function update(){
    document.getElementById("balance").innerText = balance;
    document.getElementById("level").innerText = level;
}

// Звуки
const bgMusic = document.getElementById("bgMusic");
const clickSound = document.getElementById("clickSound");
const winSound = document.getElementById("winSound");
const loseSound = document.getElementById("loseSound");
function playSound(type){
    if(type==="click") clickSound.play();
    if(type==="win") winSound.play();
    if(type==="lose") loseSound.play();
}

// Фонова музика старт після кліку
document.addEventListener("click", ()=>{
    bgMusic.play().catch(e=>console.log(e));
},{once:true});

// Показ панелі
function showPanel(id){
    document.querySelectorAll(".panel").forEach(p=>p.style.display="none");
    document.getElementById(id).style.display="block";
}

// Меню
document.getElementById("menuBtn").onclick = ()=>showPanel("menu");
document.getElementById("statsBtn").onclick = ()=>showPanel("stats");

// Ігри
document.getElementById("coinFlipGameBtn").onclick = ()=>showPanel("coinFlipPanel");
document.getElementById("rouletteGameBtn").onclick = ()=>showPanel("wheelPanel");
document.getElementById("questsGameBtn").onclick = ()=>showPanel("questsPanel");

// Coin Flip
const coin = document.getElementById("coin");
const coinBet = document.getElementById("coinBet");
const coinMessage = document.getElementById("coinMessage");
document.getElementById("headsBtn").onclick = ()=>flipCoin("Орёл");
document.getElementById("tailsBtn").onclick = ()=>flipCoin("Решка");

function flipCoin(choice){
    let bet = parseInt(coinBet.value);
    if(isNaN(bet)||bet<=0){coinMessage.innerText="Введіть коректну ставку!"; return;}
    if(bet>balance){coinMessage.innerText="Недостатньо грошей!"; return;}
    balance -= bet; update();
    coin.classList.remove("coin-flip");
    void coin.offsetWidth;
    coin.classList.add("coin-flip");
    setTimeout(()=>{
        const result = Math.random()<0.5 ? "Орёл" : "Решка";
        coin.innerText = result==="Орёл" ? "🦅" : "🐍";
        if(choice===result){
            let winAmount = bet*2; balance+=winAmount; totalWins+=winAmount;
            coinMessage.innerText=`✅ Ви виграли ${winAmount} монет!`; coinMessage.className="winMessage";
            playSound("win");
        } else {
            totalLosses+=bet;
            coinMessage.innerText="❌ Програш!"; coinMessage.className="loseMessage";
            playSound("lose");
        }
        update();
    },2000);
}

// Квести
const quests = [
    {question:"Який колір суміші синього та жовтого?", options:["Зелений","Фіолетовий","Помаранчевий"], answer:0},
    {question:"Скільки днів у лютому у невисокосний рік?", options:["28","29","30"], answer:0},
    {question:"Яка планета найближча до Сонця?", options:["Марс","Меркурій","Венера"], answer:1}
];
const questText = document.getElementById("questText");
const questOptions = document.getElementById("questOptions");
const questMessage = document.getElementById("questMessage");
document.getElementById("newQuestBtn").onclick = generateQuest;
function generateQuest(){
    const q = quests[Math.floor(Math.random()*quests.length)];
    questText.innerText = q.question;
    questOptions.innerHTML="";
    questMessage.innerText="";
    q.options.forEach((opt,i)=>{
        const btn=document.createElement("button");
        btn.innerText = opt;
        btn.onclick = ()=>{
            if(i===q.answer){balance+=50; totalWins+=50; questMessage.innerText="✅ Правильно! +50 грошей"; questMessage.className="winMessage"; playSound("win");}
            else{questMessage.innerText="❌ Неправильно!"; questMessage.className="loseMessage"; playSound("lose");}
            update();
        };
        questOptions.appendChild(btn);
    });
}

// Колесо Фортуни
const wheelCanvas = document.getElementById("wheelCanvas");
const wheelCtx = wheelCanvas.getContext("2d");
const wheelBet = document.getElementById("wheelBet");
const spinWheelBtn = document.getElementById("spinWheelBtn");
const wheelMessage = document.getElementById("wheelMessage");
const sectors = [{color:"red",label:"Червоний"},{color:"black",label:"Чорний"},{color:"white",label:"Білий"}];
let angle = 0; let spinning=false;

function drawWheel(){
    const ctx = wheelCtx; const radius = wheelCanvas.width/2;
    ctx.clearRect(0,0,wheelCanvas.width,wheelCanvas.height);
    const segAngle=(2*Math.PI)/sectors.length;
    sectors.forEach((s,i)=>{
        ctx.beginPath(); ctx.moveTo(radius,radius);
        ctx.arc(radius,radius,radius,i*segAngle,(i+1)*segAngle);
        ctx.fillStyle=s.color; ctx.fill(); ctx.stroke();
        ctx.save(); ctx.translate(radius,radius);
        ctx.rotate(i*segAngle+segAngle/2);
        ctx.textAlign="right"; ctx.fillStyle="#fff"; ctx.font="16px Arial";
        ctx.fillText(s.label,radius-10,5); ctx.restore();
    });
}
drawWheel();

function spinWheel(){
    if(spinning) return;
    let bet=parseInt(wheelBet.value);
    if(isNaN(bet)||bet<=0){wheelMessage.innerText="Введіть коректну ставку!"; return;}
    if(bet>balance){wheelMessage.innerText="Недостатньо грошей!"; return;}
    balance-=bet; update();
    spinning=true;
    let duration=4000; let spins=Math.random()*4+4; let start=null;
    function animate(time){
        if(!start) start=time;
        let progress=time-start; let t=Math.min(progress/duration,1);
        let easeOut=1-Math.pow(1-t,3);
        angle=easeOut*spins*2*Math.PI;
        wheelCanvas.style.transform=`rotate(${angle}rad)`;
        if(t<1) requestAnimationFrame(animate);
        else{
            spinning=false;
            let segAngle=(2*Math.PI)/sectors.length;
            let index=sectors.length-Math.floor((angle%(2*Math.PI))/segAngle)-1;
            index=(index+sectors.length)%sectors.length;
            let result=sectors[index].label;
            if(result==="Червоний") winWheel(bet);
            else loseWheel(bet);
        }
    }
    requestAnimationFrame(animate);
}

function winWheel(bet){let winAmount=bet*2; balance+=winAmount; totalWins+=winAmount; wheelMessage.innerText=`✅ Виграш! ${winAmount} монет`; wheelMessage.className="winMessage"; playSound("win"); fireworks(); update();}
function loseWheel(bet){totalLosses+=bet; wheelMessage.innerText="❌ Програш!"; wheelMessage.className="loseMessage"; playSound("lose"); update();}

spinWheelBtn.onclick=spinWheel;

// Функція частинок
function fireworks(){
    const canvas=document.getElementById("particles");
    const ctx=canvas.getContext("2d");
    canvas.width=window.innerWidth; canvas.height=window.innerHeight;
    for(let i=0;i<50;i++){
        ctx.fillStyle=`hsl(${Math.random()*360},100%,50%)`;
        ctx.beginPath();
        ctx.arc(Math.random()*canvas.width, Math.random()*canvas.height, Math.random()*5+2,0,2*Math.PI);
        ctx.fill();
    }
}

// Ініціалізація
update();
