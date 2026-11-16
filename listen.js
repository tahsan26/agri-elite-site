/* AGRi Elite Arena - "Listen" button on opened answers (browser text-to-speech, no server, no cost). */
(function(){
if(!('speechSynthesis' in window)||window.__agriListen)return;window.__agriListen=1;
var SS=window.speechSynthesis,cur=null,rate=1;
var css=document.createElement('style');css.textContent='.lsn{margin:8px 8px 8px 0;padding:8px 14px;border-radius:999px;border:1px solid #7b61ff;background:transparent;color:#7b61ff;font:700 14px system-ui,sans-serif;cursor:pointer}.lsn.on{background:#7b61ff;color:#fff}html[data-theme=dark] .lsn{color:#b9a8ff;border-color:#b9a8ff}html[data-theme=dark] .lsn.on{background:#7b61ff;color:#fff}.lsn-r{margin:8px 8px 8px 0;padding:8px 10px;border-radius:999px;border:1px solid #bbb;background:transparent;color:inherit;font:600 13px system-ui,sans-serif;cursor:pointer}';document.head.appendChild(css);
function stop(){SS.cancel();if(cur){cur.classList.remove('on');cur.textContent='🔊 Listen';cur=null}}
function isBn(x){var b=(x.match(/[\u0980-\u09FF]/g)||[]).length,l=(x.match(/[A-Za-z\u0980-\u09FF]/g)||[]).length;return l>0&&b/l>0.4}
function chunks(t){var out=[],cur='';(t.match(/[^.!?\u0964]+[.!?\u0964]*\s*/g)||[t]).forEach(function(s){s=s.trim();if(!s)return;cur+=(cur?' ':'')+s;if(cur.length>160){out.push(cur);cur=''}});if(cur)out.push(cur);
 return out.map(function(x){var bn=isBn(x);if(!bn)x=x.replace(/\([^)]*[\u0980-\u09FF][^)]*\)/g,' ').replace(/[\u0980-\u09FF]+/g,' ').replace(/\s+/g,' ').trim();return[x,bn]}).filter(function(p){return p[0]&&/[A-Za-z\u0980-\u09FF0-9]/.test(p[0])})}
function voiceFor(lang){var v=SS.getVoices();return v.filter(function(x){return x.lang&&x.lang.toLowerCase().replace('_','-').indexOf(lang.toLowerCase())===0})[0]||null}
function speak(d,btn){stop();var c=d.cloneNode(true);['summary','.aiw-ex','.lsn','.lsn-r','button','script','style'].forEach(function(s){c.querySelectorAll(s).forEach(function(x){x.remove()})});
 c.querySelectorAll('*').forEach(function(x){x.insertAdjacentText('afterend',' ')});var t=c.textContent.replace(/\be\.g\./gi,'for example').replace(/\bi\.e\./gi,'that is').replace(/\bvs\./gi,'versus').replace(/\s+/g,' ').trim();if(!t)return;var q=chunks(t.slice(0,4000)),i=0,warnedBn=false;cur=btn;btn.classList.add('on');btn.textContent='⏹ Stop';
 (function next(){if(cur!==btn||i>=q.length){if(cur===btn)stop();return}var it=q[i++],u=new SpeechSynthesisUtterance(it[0]);u.lang=it[1]?'bn-BD':'en-US';var v=voiceFor(it[1]?'bn':'en');if(v)u.voice=v;u.rate=rate;u.onend=next;u.onerror=next;SS.speak(u)})()}
document.addEventListener('toggle',function(e){var d=e.target;if(!d||d.tagName!=='DETAILS'||!d.matches('details.card,details.ai-q')){return}
 if(!d.open){if(cur&&d.contains(cur))stop();return}
 if(d.querySelector('.lsn'))return;var b=document.createElement('button');b.type='button';b.className='lsn';b.textContent='🔊 Listen';b.setAttribute('aria-label','Listen to this answer');
 b.onclick=function(){if(cur===b)stop();else speak(d,b)};
 var r=document.createElement('button');r.type='button';r.className='lsn-r';r.textContent='1×';r.setAttribute('aria-label','Change reading speed');r.onclick=function(){rate=rate===1?0.8:rate===0.8?1.25:1;document.querySelectorAll('.lsn-r').forEach(function(x){x.textContent=(rate===1?'1':rate)+'×'});if(cur){var dd=cur.closest('details');if(dd)speak(dd,cur)}};
 d.appendChild(b);d.appendChild(r)},true);
window.addEventListener('pagehide',stop);
})();
