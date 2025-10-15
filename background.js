const defaultUA = navigator.userAgent;
chrome.storage.local.get({rules:[],global:""},r=>{
  if(!r.rules) r.rules=[];
  if(typeof r.global==="undefined") r.global="";
});
function getReplacement(details){
  return new Promise(res=>chrome.storage.local.get({rules:[],global:""},s=>{
    const url=new URL(details.url);
    const host=url.hostname;
    const hostRule=s.rules.find(x=>x.host===host);
    const ua=hostRule?.ua || s.global || "";
    res(ua);
  }));
}
chrome.webRequest.onBeforeSendHeaders.addListener(async function(details){
  const newUA=await getReplacement(details);
  if(!newUA) return {requestHeaders:details.requestHeaders};
  const headers=details.requestHeaders.map(h=>h.name.toLowerCase()==="user-agent"?{name:h.name,value:newUA}:h);
  if(!headers.some(h=>h.name.toLowerCase()==="user-agent")) headers.push({name:"User-Agent",value:newUA});
  return {requestHeaders:headers};
},{urls:["<all_urls>"]},["blocking","requestHeaders"]);
chrome.runtime.onInstalled.addListener(()=>chrome.storage.local.get({global:""},s=>{if(!s.global)chrome.storage.local.set({global:defaultUA})}));
