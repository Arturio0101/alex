// lightsout.js — mittlerer Schwierigkeitsgrad, deutsch, mit Popup-Regeln

// 🧹 Testmodus: Local Storage bei jedem Start leeren
localStorage.clear();

const gridEl = document.getElementById('grid');
const movesEl = document.getElementById('moves');
const bestEl  = document.getElementById('best');
const ptsEl   = document.getElementById('pts');
const winDlg  = document.getElementById('win');
const winPtsEl= document.getElementById('winPts');
const infoDlg = document.getElementById('infoModal');
const infoBtn = document.getElementById('infoBtn');
const startBtn= document.getElementById('startGame');


const STORAGE = {
  get points(){return +(localStorage.getItem('lr_points')||0)},
  set points(v){localStorage.setItem('lr_points',v)},
  get best(){return +(localStorage.getItem('lightsout_best')||0)||null},
  set best(v){localStorage.setItem('lightsout_best',v)},
  get seenInfo(){return localStorage.getItem('lightsout_seen_info')==='1'},
  set seenInfo(v){localStorage.setItem('lightsout_seen_info', v?'1':'0')}
};

function updatePointsUI(){ptsEl.textContent=STORAGE.points}
function awardPoints(n){STORAGE.points=STORAGE.points+n;updatePointsUI()}

const N=6; // mittleres Level
const REWARD=18;
let cells=[],moves=0,accepting=true;

function buildGrid(){
  gridEl.style.setProperty('--n', N);
  gridEl.innerHTML=''; cells=[];
  for(let r=0;r<N;r++){
    for(let c=0;c<N;c++){
      const idx=r*N+c;
      const d=document.createElement('button');
      d.className='cell on';
      d.dataset.idx=idx;
      d.addEventListener('click',()=>clickCell(r,c));
      gridEl.appendChild(d);
      cells[idx]=true;
    }
  }
  moves=0;movesEl.textContent='0';
  const best=STORAGE.best;
  bestEl.textContent=best?best:'—';
}

function inBounds(r,c){return r>=0&&r<N&&c>=0&&c<N}
function toggle(r,c){if(!inBounds(r,c))return;const i=r*N+c;cells[i]=!cells[i];gridEl.children[i].classList.toggle('on',cells[i]);gridEl.children[i].classList.toggle('off',!cells[i]);}
function flipPlus(r,c){toggle(r,c);toggle(r-1,c);toggle(r+1,c);toggle(r,c-1);toggle(r,c+1)}
function clickCell(r,c){if(!accepting)return;moves++;movesEl.textContent=moves;flipPlus(r,c);checkWin()}
function randomizeSolvable(){for(let k=0;k<14;k++){const r=Math.floor(Math.random()*N),c=Math.floor(Math.random()*N);flipPlus(r,c);}moves=0;movesEl.textContent='0';}
function isSolved(){return cells.every(v=>v)}
function checkWin(){if(!isSolved())return;accepting=false;winPtsEl.textContent=`+${REWARD}`;if(!STORAGE.best||moves<STORAGE.best){STORAGE.best=moves;bestEl.textContent=moves}winDlg.showModal();}

// Tipp-Funktion
function hint(){const darkIdx=cells.map((v,i)=>v?null:i).filter(v=>v!=null);if(!darkIdx.length)return;const idx=darkIdx[Math.floor(Math.random()*darkIdx.length)];const el=gridEl.children[idx];el.animate([{boxShadow:'0 0 0 0 rgba(255,255,255,.0)'},{boxShadow:'0 0 0 10px rgba(255,255,255,.25)'},{boxShadow:'0 0 0 0 rgba(255,255,255,.0)'}],{duration:900,easing:'ease-out'});}

// Buttons
document.getElementById('newGame').addEventListener('click',()=>{accepting=true;buildGrid();randomizeSolvable()});
document.getElementById('hintBtn').addEventListener('click',hint);
document.getElementById('playAgain').addEventListener('click',()=>{winDlg.close();accepting=true;buildGrid();randomizeSolvable()});
document.getElementById('claim').addEventListener('click',()=>{awardPoints(REWARD);winDlg.close()});

infoBtn.addEventListener('click',()=>infoDlg.showModal());
startBtn.addEventListener('click',()=>{infoDlg.close();if(!STORAGE.seenInfo){STORAGE.seenInfo=true}});

// Init
updatePointsUI();
buildGrid();
randomizeSolvable();
if(!STORAGE.seenInfo) infoDlg.showModal();
