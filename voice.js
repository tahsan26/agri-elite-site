/* AGRi Elite Arena - voice typing (mic) for question boxes. Plain JS, no build step.
   Uses the browser's built-in speech recognition (Chrome / Edge / Android / Safari). Hidden where unsupported. */
(function(){
if(window.__agriVoice)return;window.__agriVoice=1;
var SR=window.SpeechRecognition||window.webkitSpeechRecognition;if(!SR)return;
var SEL='#aiw-i,#aiq,input[data-voice],textarea[data-voice]';
var css=document.createElement('style');css.textContent=
'.vwrap{display:inline-flex;gap:4px;align-items:center;flex:none}'+
'.vmic,.vlang{border:1px solid rgba(15,107,79,.35);background:#fff;color:#0f6b4f;cursor:pointer;font:700 13px/1 system-ui,sans-serif;border-radius:999px;height:36px;min-width:36px;padding:0 9px;display:inline-flex;align-items:center;justify-content:center;flex:none}'+
'.vmic{font-size:17px;width:36px;padding:0;background:linear-gradient(180deg,#fff,#eef7f3)}.vmic svg{display:block}.vmic.on{background:#d93025;border-color:#d93025;color:#fff;animation:vpulse 1.1s infinite}'+
'.vlang{font-size:12px}.vmic:focus-visible,.vlang:focus-visible{outline:3px solid #ffd54a;outline-offset:2px}'+
'@keyframes vpulse{0%{box-shadow:0 0 0 0 rgba(217,48,37,.5)}100%{box-shadow:0 0 0 12px rgba(217,48,37,0)}}'+
'@media(prefers-reduced-motion:reduce){.vmic.on{animation:none}}'+
'@media(prefers-color-scheme:dark){.vmic,.vlang{background:#16211e;color:#7fe0b6;border-color:#2c4a3f}}'+
'html[data-t=dark] .vmic,html[data-t=dark] .vlang,html[data-theme=dark] .vmic,html[data-theme=dark] .vlang{background:#16211e;color:#7fe0b6;border-color:#2c4a3f}'+
'#vtoast{position:fixed;left:50%;transform:translateX(-50%);top:84px;z-index:2147483200;background:#14202b;color:#fff;padding:10px 16px;border-radius:12px;font:600 14px/1.4 system-ui,sans-serif;max-width:calc(100vw - 32px);box-shadow:0 8px 24px rgba(0,0,0,.35)}';
document.head.appendChild(css);
function lang(){try{return localStorage.getItem('agri-vlang')||'bn-BD'}catch(e){return'bn-BD'}}
function setLang(l){try{localStorage.setItem('agri-vlang',l)}catch(e){}}
var tt;function toast(t){var o=document.getElementById('vtoast');if(!o){o=document.createElement('div');o.id='vtoast';o.setAttribute('role','status');document.body.appendChild(o)}o.textContent=t;o.style.display='block';clearTimeout(tt);tt=setTimeout(function(){o.style.display='none'},3800)}
var cur=null;
function stop(){if(cur){try{cur.rec.stop()}catch(e){}}}
function attach(inp){
 if(!inp||inp.dataset.vm)return;inp.dataset.vm='1';
 var w=document.createElement('span');w.className='vwrap';
 var lb=document.createElement('button');lb.type='button';lb.className='vlang';lb.title='Voice language';
 var mb=document.createElement('button');mb.type='button';mb.className='vmic';mb.innerHTML='<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5 11a7 7 0 0 0 14 0M12 18v3"/></svg>';mb.setAttribute('aria-label','Voice typing');mb.title='Voice typing';
 function lt(){lb.textContent=lang()==='bn-BD'?'বাং':'EN';lb.setAttribute('aria-label','Voice language: '+(lang()==='bn-BD'?'Bangla':'English')+' (tap to change)')}lt();
 lb.onclick=function(e){e.preventDefault();setLang(lang()==='bn-BD'?'en-US':'bn-BD');lt();toast(lang()==='bn-BD'?'ভয়েস ভাষা: বাংলা':'Voice language: English')};
 mb.onclick=function(e){e.preventDefault();
  if(cur&&cur.btn===mb){stop();return}
  stop();
  var rec=new SR();rec.lang=lang();rec.interimResults=true;rec.continuous=false;rec.maxAlternatives=1;
  var base=inp.value?inp.value.replace(/\s+$/,'')+' ':'',got=false;
  rec.onstart=function(){mb.classList.add('on');mb.setAttribute('aria-pressed','true');toast(lang()==='bn-BD'?'বলুন… আপনার প্রশ্ন শুনছি':'Listening… speak now')};
  rec.onresult=function(ev){var t='';for(var i=0;i<ev.results.length;i++)t+=ev.results[i][0].transcript;got=true;inp.value=(base+t).slice(0,+inp.maxLength>0?+inp.maxLength:1000);inp.dispatchEvent(new Event('input',{bubbles:true}))};
  rec.onerror=function(ev){var m={'not-allowed':'মাইক্রোফোনের অনুমতি দিন (ব্রাউজার সেটিংসে Allow করুন)','service-not-allowed':'এই ব্রাউজারে ভয়েস টাইপিং চালু নেই','no-speech':'কিছু শোনা যায়নি, আবার চেষ্টা করুন','audio-capture':'মাইক্রোফোন পাওয়া যায়নি','network':'ভয়েস টাইপিংয়ের জন্য ইন্টারনেট লাগবে','language-not-supported':'এই ভাষা সমর্থিত নয়, EN চেপে দেখুন'}[ev.error];if(m&&ev.error!=='aborted')toast(m)};
  rec.onend=function(){mb.classList.remove('on');mb.setAttribute('aria-pressed','false');if(cur&&cur.btn===mb)cur=null;if(got)inp.focus()};
  cur={rec:rec,btn:mb};try{rec.start()}catch(x){cur=null;toast('আবার চেষ্টা করুন')}};
 w.appendChild(lb);w.appendChild(mb);
 inp.insertAdjacentElement('afterend',w);
}
function scan(){document.querySelectorAll(SEL).forEach(attach)}
scan();new MutationObserver(function(){scan()}).observe(document.documentElement,{childList:true,subtree:true});
document.addEventListener('visibilitychange',function(){if(document.hidden)stop()});
})();
