/* AGRi ELITE NOTES - floating AI study assistant (works without login). Plain JS, no build step. */
(function(){
if(window.__agriAi)return;window.__agriAi=1;
var script=document.currentScript;var SC=(script&&script.getAttribute('data-course'))||'';
function start(){
var C=window.AGRI_CFG;if(!C||!C.url||!C.key)return;
fetch(C.url+'/rest/v1/site_settings?select=value&key=eq.features',{headers:{apikey:C.key,Authorization:'Bearer '+C.key}}).then(function(r){return r.ok?r.json():[]}).then(function(a){
 var f=a[0]&&a[0].value;if(!f||f.ai!==true)return;build(C)}).catch(function(){})}
function dev(){try{var d=localStorage.getItem('agri_dev');if(!d){d=(self.crypto&&crypto.randomUUID)?crypto.randomUUID():('d'+Math.random().toString(36).slice(2)+Date.now().toString(36));localStorage.setItem('agri_dev',d)}return d}catch(e){return 'nodevice-'+Math.random().toString(36).slice(2,10)}}
function userToken(){try{for(var i=0;i<localStorage.length;i++){var k=localStorage.key(i);if(/^sb-.*-auth-token$/.test(k)){var o=JSON.parse(localStorage.getItem(k));if(o&&o.access_token&&(!o.expires_at||o.expires_at>Date.now()/1000+30))return o.access_token}}}catch(e){}return null}
function build(C){
var css=document.createElement('style');css.textContent=
'#aiw-b{position:fixed;right:16px;bottom:16px;z-index:2147483000;background:#0f6b4f;color:#fff;border:0;border-radius:999px;padding:12px 18px;font:700 15px/1 system-ui,sans-serif;box-shadow:0 6px 20px rgba(0,0,0,.28);cursor:pointer;display:flex;gap:8px;align-items:center}'+
'#aiw-bx{position:fixed;right:8px;bottom:58px;z-index:2147483000;width:22px;height:22px;border-radius:50%;border:1px solid rgba(0,0,0,.12);background:#fff;color:#4b5b56;cursor:pointer;display:flex;align-items:center;justify-content:center;padding:0;box-shadow:0 2px 8px rgba(0,0,0,.2)}#aiw-bx:hover{background:#fee2e2;color:#b91c1c}'+
'#aiw-b:focus-visible,#aiw-x:focus-visible,#aiw-s:focus-visible{outline:3px solid #ffd54a;outline-offset:2px}'+
'#aiw-p{position:fixed;right:16px;bottom:16px;z-index:2147483001;width:360px;max-width:calc(100vw - 24px);height:min(560px,calc(100vh - 32px));background:#fff;color:#14202b;border:1px solid #dbe4e1;border-radius:16px;box-shadow:0 12px 40px rgba(0,0,0,.35);display:none;flex-direction:column;overflow:hidden;font:15px/1.5 system-ui,"Hind Siliguri",sans-serif}'+
'#aiw-p.on{display:flex}#aiw-h{background:#0f6b4f;color:#fff;padding:10px 14px;display:flex;align-items:center;gap:8px}#aiw-h b{flex:1;font-size:15px}#aiw-h small{display:block;font-weight:400;opacity:.85;font-size:12px}'+
'#aiw-x{background:transparent;border:0;color:#fff;font-size:22px;cursor:pointer;line-height:1;padding:2px 6px}'+
'#aiw-m{flex:1;overflow:auto;padding:12px;background:#f7faf8}.aiw-u,.aiw-a{margin:8px 0;padding:9px 12px;border-radius:12px;white-space:pre-wrap;word-wrap:break-word;max-width:92%}.aiw-u{background:#d9f3e7;margin-left:auto}.aiw-a{background:#fff;border:1px solid #dbe4e1}.aiw-e{margin:8px 0;padding:9px 12px;border-radius:12px;background:#fdecea;color:#8a1c1c;font-size:14px}.aiw-n{color:#5b6b77;font-size:13px;margin:8px 0}'+
'#aiw-f{display:flex;gap:8px;padding:10px;border-top:1px solid #dbe4e1;background:#fff}#aiw-i{flex:1;padding:10px;border:1px solid #c5d3cf;border-radius:10px;font:inherit;background:#fff;color:#14202b;min-width:0}#aiw-s{background:#0f6b4f;color:#fff;border:0;border-radius:10px;padding:0 16px;font:700 15px system-ui;cursor:pointer}#aiw-s:disabled{opacity:.5}'+
'#aiw-t{padding:0 12px 8px;font-size:12px;color:#5b6b77;background:#fff}'+
'@media(prefers-color-scheme:dark){#aiw-p{background:#16211e;color:#e6efec;border-color:#26372f}#aiw-m{background:#0e1614}.aiw-u{background:#17352b}.aiw-a{background:#16211e;border-color:#26372f}#aiw-f,#aiw-t{background:#16211e;border-color:#26372f}#aiw-i{background:#0e1614;color:#e6efec;border-color:#26372f}.aiw-e{background:#3a1c1c;color:#ffb4b4}.aiw-n,#aiw-t{color:#93a6a0}}';
document.head.appendChild(css);
var b=document.createElement('button');b.id='aiw-b';b.type='button';b.setAttribute('aria-label','Open AI study assistant');b.innerHTML='<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 12a8 8 0 0 1-11.5 7.2L3 21l1.8-6.1A8 8 0 1 1 21 12z"/></svg><span>Ask AI</span>';
var p=document.createElement('div');p.id='aiw-p';p.setAttribute('role','dialog');p.setAttribute('aria-label','AI study assistant');
p.innerHTML='<div id="aiw-h"><b>AI Study Assistant<small id="aiw-c"></small></b><button id="aiw-x" type="button" aria-label="Close">×</button></div><div id="aiw-m" aria-live="polite"></div><form id="aiw-f"><input id="aiw-i" maxlength="1000" placeholder="Ask a study question (বাংলা / English)" required autocomplete="off"><button id="aiw-s">Send</button></form><div id="aiw-t">Answers may contain mistakes; check important facts in your notes. Free: a few questions per day (more if you sign in to the student portal).</div>';
var bx=document.createElement('button');bx.id='aiw-bx';bx.type='button';bx.setAttribute('aria-label','Hide the Ask AI button');bx.title='Hide';bx.innerHTML='<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg>';
function off(){try{return Date.now()-(+localStorage.getItem('agri-aiw-off')||0)<6048e5}catch(e){return false}}
document.body.appendChild(b);document.body.appendChild(bx);document.body.appendChild(p);if(off()){b.style.display='none';bx.style.display='none'}if(!window.__agriVoice){var vs=document.createElement('script');vs.src='voice.js';vs.defer=true;document.head.appendChild(vs)}
var M=p.querySelector('#aiw-m'),I=p.querySelector('#aiw-i'),S=p.querySelector('#aiw-s'),H=[];
function course(){return window.AGRI_AI_COURSE||SC||''}
function add(cls,text){var d=document.createElement('div');d.className=cls;d.textContent=text;M.appendChild(d);M.scrollTop=M.scrollHeight;return d}
function open(){b.style.display='none';bx.style.display='none';p.classList.add('on');var c=course();p.querySelector('#aiw-c').textContent=c?('Course: '+c):'';if(!M.childNodes.length)add('aiw-n',c?('Ask anything about '+c+'.'):'Ask me about your agriculture courses.');setTimeout(function(){I.focus()},50)}
function close(){p.classList.remove('on');if(!off()){b.style.display='flex';bx.style.display='flex'}b.focus()}
bx.onclick=function(){try{localStorage.setItem('agri-aiw-off',Date.now())}catch(e){}b.style.display='none';bx.style.display='none'};
b.onclick=open;p.querySelector('#aiw-x').onclick=close;p.addEventListener('keydown',function(e){if(e.key==='Escape')close()});
function send(t,shown){if(S.disabled)return;S.disabled=true;add('aiw-u',shown||t);H.push({role:'user',text:t});var w=add('aiw-n','Thinking…');
 var tok=userToken();
 fetch(C.url+'/functions/v1/ask-ai',{method:'POST',headers:{'Content-Type':'application/json',apikey:C.key,Authorization:'Bearer '+(tok||C.key)},body:JSON.stringify({messages:H.slice(-7),course:course(),device:dev()})})
 .then(function(r){return r.json().catch(function(){return{}}).then(function(d){return{ok:r.ok,d:d}})})
 .then(function(x){w.remove();if(x.ok&&x.d.answer){H.push({role:'assistant',text:x.d.answer});add('aiw-a',x.d.answer);add('aiw-n','Questions left today: '+x.d.left)}else{H.pop();add('aiw-e',(x.d&&x.d.error)||'Something went wrong. Please try again.')}})
 .catch(function(){w.remove();H.pop();add('aiw-e','Could not reach the AI service. Check your internet.')})
 .then(function(){S.disabled=false;I.focus()})}
p.querySelector('#aiw-f').onsubmit=function(e){e.preventDefault();var t=I.value.trim();if(!t)return;I.value='';send(t)};
window.AgriAi={ask:function(t,shown){open();send(t,shown)}};
document.addEventListener('toggle',function(e){var d=e.target;if(!d||d.tagName!=='DETAILS'||!d.open||!d.matches('details.card,details.ai-q')||d.querySelector('.aiw-ex'))return;
 var btn=document.createElement('button');btn.type='button';btn.className='aiw-ex';btn.textContent='Explain simply (AI)';btn.setAttribute('style','margin:8px 0;padding:8px 14px;border-radius:999px;border:1px solid #0f6b4f;background:transparent;color:#0f6b4f;font:700 14px system-ui,sans-serif;cursor:pointer');
 btn.onclick=function(){var sm=d.querySelector('summary'),q=(sm?sm.textContent:'').replace(/\s+/g,' ').trim().slice(0,300),c=d.cloneNode(true);var x=c.querySelector('summary');if(x)x.remove();var y=c.querySelector('.aiw-ex');if(y)y.remove();var a=c.textContent.replace(/\s+/g,' ').trim().slice(0,900);
  window.AgriAi.ask('Explain this exam answer in very simple Bangla (keep key English terms), in 5-6 short lines, with one easy example if useful.\nQuestion: '+q+'\nAnswer: '+a,'Explain: '+q.slice(0,120))};
 d.appendChild(btn)},true);
}
if(window.AGRI_CFG)start();else{var s=document.createElement('script');s.src='config.js';s.onload=start;document.head.appendChild(s)}
})();
