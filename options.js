const globalInput=document.getElementById("global");
const hostInput=document.getElementById("host");
const hostUAInput=document.getElementById("hostua");
const addBtn=document.getElementById("add");
const saveBtn=document.getElementById("save");
const resetBtn=document.getElementById("reset");
const tbody=document.querySelector("#rulesTable tbody");
function render(rules){
  tbody.innerHTML="";
  rules.forEach((rule,i)=>{
    const tr=document.createElement("tr");
    tr.innerHTML=`<td>${rule.host}</td><td>${rule.ua}</td><td><button data-i="${i}">Del</button></td>`;
    tbody.appendChild(tr);
  });
}
chrome.storage.local.get({rules:[],global:""},s=>{
  render(s.rules);
  globalInput.value=s.global||"";
});
tbody.addEventListener("click",e=>{
  if(e.target.tagName!=="BUTTON") return;
  const i=+e.target.dataset.i;
  chrome.storage.local.get({rules:[]},s=>{
    s.rules.splice(i,1);
    chrome.storage.local.set({rules:s.rules},()=>render(s.rules));
  });
});
addBtn.addEventListener("click",()=>{
  const host=hostInput.value.trim();
  const ua=hostUAInput.value.trim();
  if(!host||!ua) return;
  chrome.storage.local.get({rules:[]},s=>{
    s.rules.push({host,ua});
    chrome.storage.local.set({rules:s.rules},()=>{render(s.rules);hostInput.value="";hostUAInput.value="";});
  });
});
saveBtn.addEventListener("click",()=>chrome.storage.local.set({global:globalInput.value.trim()}));
resetBtn.addEventListener("click",()=>chrome.storage.local.set({global:""},()=>globalInput.value=""));
