/* AGRi Elite Arena - floating AI study assistant (works without login). Plain JS, no build step. */
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
'#aiw-b{position:fixed;right:max(14px,env(safe-area-inset-right,0px));bottom:max(14px,env(safe-area-inset-bottom,0px));z-index:2147483000;background:linear-gradient(135deg,#7b61ff,#0f6b4f);color:#fff;border:0;border-radius:999px;padding:11px 16px 11px 13px;font:700 15px/1 system-ui,"Hind Siliguri",sans-serif;box-shadow:0 8px 22px rgba(40,20,90,.35);cursor:pointer;display:flex;gap:7px;align-items:center;transition:transform .15s,padding .2s}#aiw-b:hover{transform:translateY(-2px)}#aiw-b:active{transform:translateY(1px)}#aiw-b.mini{padding:13px}#aiw-b.mini span{display:none}#aiw-b.mini+#aiw-bx{display:none!important}'+
'body.aiw-on #up,body.aiw-on #tt{bottom:78px!important}'+
'#aiw-bx{position:fixed;right:max(6px,env(safe-area-inset-right,0px));bottom:calc(max(14px,env(safe-area-inset-bottom,0px)) + 38px);z-index:2147483000;width:22px;height:22px;border-radius:50%;border:1px solid rgba(0,0,0,.12);background:#fff;color:#4b5b56;cursor:pointer;display:flex;align-items:center;justify-content:center;padding:0;box-shadow:0 2px 8px rgba(0,0,0,.2)}#aiw-bx:hover{background:#fee2e2;color:#b91c1c}'+
'#aiw-b:focus-visible,#aiw-x:focus-visible,#aiw-s:focus-visible{outline:3px solid #ffd54a;outline-offset:2px}'+
'#aiw-p{position:fixed;right:16px;bottom:16px;z-index:2147483001;width:360px;max-width:calc(100vw - 24px);height:min(560px,calc(100vh - 32px));background:#fff;color:#14202b;border:1px solid #dbe4e1;border-radius:16px;box-shadow:0 12px 40px rgba(0,0,0,.35);display:none;flex-direction:column;overflow:hidden;font:15px/1.5 system-ui,"Hind Siliguri",sans-serif}'+
'#aiw-p.on{display:flex}#aiw-h{background:#0f6b4f;color:#fff;padding:10px 14px;display:flex;align-items:center;gap:8px}#aiw-h b{flex:1;font-size:15px}#aiw-h small{display:block;font-weight:400;opacity:.85;font-size:12px}'+
'#aiw-x{background:transparent;border:0;color:#fff;font-size:22px;cursor:pointer;line-height:1;padding:2px 6px}'+
'#aiw-m{flex:1;overflow:auto;padding:12px;background:#f7faf8}.aiw-u,.aiw-a{margin:8px 0;padding:9px 12px;border-radius:12px;white-space:pre-wrap;word-wrap:break-word;max-width:92%}.aiw-u{background:#d9f3e7;margin-left:auto}.aiw-a{background:#fff;border:1px solid #dbe4e1}.aiw-e{margin:8px 0;padding:9px 12px;border-radius:12px;background:#fdecea;color:#8a1c1c;font-size:14px}.aiw-n{color:#5b6b77;font-size:13px;margin:8px 0}'+
'#aiw-f{display:flex;gap:8px;padding:10px;border-top:1px solid #dbe4e1;background:#fff}#aiw-i{flex:1;padding:10px;border:1px solid #c5d3cf;border-radius:10px;font:inherit;background:#fff;color:#14202b;min-width:0}#aiw-s{background:#0f6b4f;color:#fff;border:0;border-radius:10px;padding:0 16px;font:700 15px system-ui;cursor:pointer}#aiw-s:disabled{opacity:.5}'+
'#aiw-a{flex:none;width:38px;border:1px solid #c5d3cf;background:#fff;color:#0f6b4f;border-radius:10px;cursor:pointer;display:inline-flex;align-items:center;justify-content:center;padding:0}#aiw-a:disabled{opacity:.5}#aiw-a:focus-visible{outline:3px solid #ffd54a;outline-offset:2px}'+
'#aiw-ch{display:none;gap:8px;padding:8px 10px 0;background:#fff;overflow-x:auto;flex:none}#aiw-ch.on{display:flex}.aiw-c{position:relative;flex:none;width:54px;height:54px;border-radius:10px;overflow:hidden;border:1px solid #c5d3cf;background:#eef3f1}.aiw-c img{width:100%;height:100%;object-fit:cover;display:block}.aiw-c i{position:absolute;left:3px;bottom:3px;font:700 10px/1 system-ui;background:rgba(0,0,0,.65);color:#fff;border-radius:6px;padding:2px 4px;font-style:normal}.aiw-c button{position:absolute;top:2px;right:2px;width:18px;height:18px;border:0;border-radius:50%;background:rgba(0,0,0,.7);color:#fff;font-size:12px;line-height:1;cursor:pointer;padding:0}.aiw-th{display:flex;gap:6px;flex-wrap:wrap;margin-bottom:6px}.aiw-th img{width:64px;height:64px;object-fit:cover;border-radius:8px;border:1px solid rgba(0,0,0,.12)}'+
'#aiw-t{padding:0 12px 8px;font-size:12px;color:#5b6b77;background:#fff}'+
'@media(prefers-color-scheme:dark){#aiw-p{background:#16211e;color:#e6efec;border-color:#26372f}#aiw-m{background:#0e1614}.aiw-u{background:#17352b}.aiw-a{background:#16211e;border-color:#26372f}#aiw-f,#aiw-t{background:#16211e;border-color:#26372f}#aiw-ch{background:#16211e}#aiw-a{background:#0e1614;color:#7fe0b6;border-color:#26372f}.aiw-c{border-color:#26372f;background:#0e1614}#aiw-i{background:#0e1614;color:#e6efec;border-color:#26372f}.aiw-e{background:#3a1c1c;color:#ffb4b4}.aiw-n,#aiw-t{color:#93a6a0}}';
document.head.appendChild(css);
var b=document.createElement('button');b.id='aiw-b';b.type='button';b.setAttribute('aria-label','Open AI study assistant');b.innerHTML='<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 3l1.9 4.6L18.5 9.5l-4.6 1.9L12 16l-1.9-4.6L5.5 9.5l4.6-1.9z"/><path d="M19 15l.8 2.2L22 18l-2.2.8L19 21l-.8-2.2L16 18l2.2-.8z"/></svg><span>Ask AI</span>';
var p=document.createElement('div');p.id='aiw-p';p.setAttribute('role','dialog');p.setAttribute('aria-label','AI study assistant');
p.innerHTML='<div id="aiw-h"><b>AI Study Assistant<small id="aiw-c"></small></b><button id="aiw-x" type="button" aria-label="Close">×</button></div><div id="aiw-m" aria-live="polite"></div><div id="aiw-ch" aria-label="Attached pictures"></div><form id="aiw-f"><input id="aiw-i" maxlength="1000" placeholder="Ask a study question (বাংলা / English)" autocomplete="off"><button id="aiw-a" type="button" aria-label="Attach a photo or video" title="Photo / video"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="4" width="18" height="16" rx="3"/><circle cx="9" cy="10" r="1.8"/><path d="M21 16l-5-5-8 8"/></svg></button><input id="aiw-fi" type="file" accept="image/*,video/*" multiple hidden><button id="aiw-s">Send</button></form><div id="aiw-t">Answers may contain mistakes; check important facts in your notes. You can attach photos (up to 4) or one short video; for a video the AI sees a few frames, not the sound. Free: a few questions per day (more if you sign in to the student portal).</div>';
var bx=document.createElement('button');bx.id='aiw-bx';bx.type='button';bx.setAttribute('aria-label','Make the Ask AI button smaller');bx.title='Smaller';bx.innerHTML='<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg>';
function off(){return false}try{localStorage.removeItem('agri-aiw-off');if(localStorage.getItem('agri-aiw-mini')==='1')b.classList.add('mini')}catch(e){}document.body.classList.add('aiw-on');
document.body.appendChild(b);document.body.appendChild(bx);document.body.appendChild(p);if(off()){b.style.display='none';bx.style.display='none'}if(!window.__agriVoice){var vs=document.createElement('script');vs.src='voice.js';vs.defer=true;document.head.appendChild(vs)}
var M=p.querySelector('#aiw-m'),I=p.querySelector('#aiw-i'),S=p.querySelector('#aiw-s'),H=[];
function course(){return window.AGRI_AI_COURSE||SC||''}
function add(cls,text){var d=document.createElement('div');d.className=cls;d.textContent=text;M.appendChild(d);M.scrollTop=M.scrollHeight;return d}
function open(){b.style.display='none';bx.style.display='none';p.classList.add('on');var c=course();p.querySelector('#aiw-c').textContent=c?('Course: '+c):'';if(!M.childNodes.length)add('aiw-n',c?('Ask anything about '+c+'.'):'Ask me about your agriculture courses.');setTimeout(function(){I.focus()},50)}
function close(){p.classList.remove('on');if(!off()){b.style.display='flex';bx.style.display='flex'}b.focus()}
bx.onclick=function(){b.classList.add('mini');try{localStorage.setItem('agri-aiw-mini','1')}catch(e){}b.title='Ask AI';b.focus()};
b.onclick=open;p.querySelector('#aiw-x').onclick=close;p.addEventListener('keydown',function(e){if(e.key==='Escape')close()});
var A=[],FI=p.querySelector('#aiw-fi'),AB=p.querySelector('#aiw-a'),CH=p.querySelector('#aiw-ch'),busyA=false;
function note(t){var n=add('aiw-n',t);setTimeout(function(){if(n.parentNode)n.remove()},6000)}
function chips(){CH.innerHTML='';CH.classList.toggle('on',A.length>0);A.forEach(function(a,i){var c=document.createElement('div');c.className='aiw-c';var im=document.createElement('img');im.alt='Attached picture';im.src=a.thumb;c.appendChild(im);if(a.video){var v=document.createElement('i');v.textContent='VIDEO';c.appendChild(v)}var x=document.createElement('button');x.type='button';x.textContent='\u00D7';x.setAttribute('aria-label','Remove');x.onclick=function(){A.splice(i,1);chips()};c.appendChild(x);CH.appendChild(c)})}
function count(){var n=0;A.forEach(function(a){n+=a.frames.length});return n}
function toB64(cv,q){return new Promise(function(res){cv.toBlob(function(bl){if(!bl)return res(null);var r=new FileReader();r.onload=function(){res(String(r.result).split(',')[1]||null)};r.readAsDataURL(bl)},'image/jpeg',q)})}
async function shrink(src,w,h,max,q){var k=Math.min(1,max/Math.max(w,h)),cw=Math.max(1,Math.round(w*k)),ch=Math.max(1,Math.round(h*k)),cv=document.createElement('canvas');cv.width=cw;cv.height=ch;cv.getContext('2d').drawImage(src,0,0,cw,ch);var d=await toB64(cv,q);if(d&&d.length>700000){d=await toB64(cv,.55)}return{data:d,url:cv.toDataURL('image/jpeg',.5)}}
async function addImage(f){var bm=await createImageBitmap(f,{imageOrientation:'from-image'});var r=await shrink(bm,bm.width,bm.height,1280,.8);if(bm.close)bm.close();if(!r.data||r.data.length>880000)throw new Error('big');var t=document.createElement('canvas');return{thumb:await thumbOf(r.url),frames:[r.data],video:false}}
function thumbOf(u){return new Promise(function(res){var i=new Image();i.onload=function(){var c=document.createElement('canvas');c.width=c.height=108;var x=c.getContext('2d'),k=Math.max(108/i.width,108/i.height);x.drawImage(i,(108-i.width*k)/2,(108-i.height*k)/2,i.width*k,i.height*k);res(c.toDataURL('image/jpeg',.7))};i.onerror=function(){res(u)};i.src=u})}
function addVideo(f){return new Promise(function(res,rej){var v=document.createElement('video'),url=URL.createObjectURL(f),fin=false;v.muted=true;v.playsInline=true;v.preload='auto';
 function done(e,r){if(fin)return;fin=true;clearTimeout(tm);URL.revokeObjectURL(url);v.removeAttribute('src');try{v.load()}catch(x){}e?rej(e):res(r)}
 var tm=setTimeout(function(){done(new Error('slow'))},45000);
 v.onerror=function(){done(new Error('video'))};
 v.onloadedmetadata=async function(){try{var du=v.duration;if(!isFinite(du)||du<=0)return done(new Error('video'));if(du>240)return done(new Error('long'));var n=du<6?4:6,fr=[],th=null;
  for(var i=0;i<n;i++){var t=Math.min(du-.05,Math.max(0,du*(i+.5)/n));await new Promise(function(ok,no){var h=function(){v.removeEventListener('seeked',h);ok()};v.addEventListener('seeked',h);v.currentTime=t});
   var r=await shrink(v,v.videoWidth||640,v.videoHeight||360,640,.7);if(r.data&&r.data.length<420000){fr.push(r.data);if(!th)th=await thumbOf(r.url)}}
  if(!fr.length)return done(new Error('video'));done(null,{thumb:th,frames:fr,video:true})}catch(e){done(e)}}
 v.src=url})}
AB.onclick=function(){if(busyA||S.disabled)return;FI.click()};
FI.onchange=async function(){var files=Array.prototype.slice.call(FI.files||[]);FI.value='';if(!files.length)return;busyA=true;AB.disabled=true;var w=add('aiw-n','Preparing your file…');
 try{for(var k=0;k<files.length;k++){var f=files[k];
  if(A.some(function(a){return a.video})&&/^video\//.test(f.type)){note('Only one video at a time.');continue}
  if(/^video\//.test(f.type)){if(A.length){note('Remove the photos first, or send the video separately.');continue}if(f.size>80*1048576){note('That video is too large (limit about 80 MB). Please trim it.');continue}
   try{A.push(await addVideo(f))}catch(e){note(e&&e.message==='long'?'That video is too long (limit 4 minutes).':'This video format could not be read here. Try a different video or send photos.')}}
  else if(/^image\/(jpeg|png|webp|heic|heif|gif|bmp)$/i.test(f.type)||/\.(jpe?g|png|webp)$/i.test(f.name)){if(A.some(function(a){return a.video})){note('Remove the video first, or send photos separately.');continue}if(count()>=4){note('You can attach up to 4 photos.');continue}
   try{A.push(await addImage(f))}catch(e){note('This picture could not be used. Try a JPG or PNG.')}}
  else note('Please choose a photo or a video.')}}
 finally{w.remove();busyA=false;AB.disabled=false;chips()}};
function send(t,shown,imgs,vid){if(S.disabled)return;S.disabled=true;AB.disabled=true;var ub=add('aiw-u',shown||t);
 if(imgs&&imgs.length){var th=document.createElement('div');th.className='aiw-th';imgs.forEach(function(a){var i=document.createElement('img');i.src=a.thumb;i.alt='Attached picture';th.appendChild(i)});ub.insertBefore(th,ub.firstChild)}
 H.push({role:'user',text:imgs&&imgs.length?(shown||t)+(vid?' [video frames attached]':' [picture attached]'):t});var w=add('aiw-n',imgs&&imgs.length?'Looking at your '+(vid?'video':'picture')+'…':'Thinking…');
 var tok=userToken(),payload={messages:H.slice(-7),course:course(),device:dev()};
 if(imgs&&imgs.length){var all=[];imgs.forEach(function(a){a.frames.forEach(function(d){all.push({mime:'image/jpeg',data:d})})});payload.images=all;payload.messages[payload.messages.length-1]={role:'user',text:t}}
 fetch(C.url+'/functions/v1/ask-ai',{method:'POST',headers:{'Content-Type':'application/json',apikey:C.key,Authorization:'Bearer '+(tok||C.key)},body:JSON.stringify(payload)})
 .then(function(r){return r.json().catch(function(){return{}}).then(function(d){return{ok:r.ok,d:d}})})
 .then(function(x){w.remove();if(x.ok&&x.d.answer){H.push({role:'assistant',text:x.d.answer});add('aiw-a',x.d.answer);add('aiw-n','Questions left today: '+x.d.left)}else{H.pop();add('aiw-e',(x.d&&x.d.error)||'Something went wrong. Please try again.')}})
 .catch(function(){w.remove();H.pop();add('aiw-e','Could not reach the AI service. Check your internet.')})
 .then(function(){S.disabled=false;AB.disabled=false;I.focus()})}
p.querySelector('#aiw-f').onsubmit=function(e){e.preventDefault();if(busyA)return;var t=I.value.trim();if(!t&&!A.length)return;var imgs=A.slice(),vid=imgs.some(function(a){return a.video});
 if(imgs.length){var q=t||(vid?'Explain what is happening in this video in simple words and answer any study question shown.':'Look at this picture and explain it in simple words. If it shows a question, answer it exam-style.');
  var tx=vid?q+'\n(These pictures are frames sampled in order from a short video; there is no sound.)':q;I.value='';A=[];chips();send(tx,q,imgs,vid)}
 else{I.value='';send(t)}};
window.AgriAi={ask:function(t,shown){open();send(t,shown)}};
document.addEventListener('toggle',function(e){var d=e.target;if(!d||d.tagName!=='DETAILS'||!d.open||!d.matches('details.card,details.ai-q')||d.querySelector('.aiw-ex'))return;
 var btn=document.createElement('button');btn.type='button';btn.className='aiw-ex';btn.textContent='Explain simply (AI)';btn.setAttribute('style','margin:8px 0;padding:8px 14px;border-radius:999px;border:1px solid #0f6b4f;background:transparent;color:#0f6b4f;font:700 14px system-ui,sans-serif;cursor:pointer');
 btn.onclick=function(){var sm=d.querySelector('summary'),q=(sm?sm.textContent:'').replace(/\s+/g,' ').trim().slice(0,300),c=d.cloneNode(true);var x=c.querySelector('summary');if(x)x.remove();var y=c.querySelector('.aiw-ex');if(y)y.remove();var a=c.textContent.replace(/\s+/g,' ').trim().slice(0,900);
  window.AgriAi.ask('Explain this exam answer in very simple Bangla (keep key English terms), in 5-6 short lines, with one easy example if useful.\nQuestion: '+q+'\nAnswer: '+a,'Explain: '+q.slice(0,120))};
 d.appendChild(btn)},true);
}
if(window.AGRI_CFG)start();else{var s=document.createElement('script');s.src='config.js';s.onload=start;document.head.appendChild(s)}
})();
