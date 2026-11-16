/* Live exam countdown on the home page (ticks every second). Data: Admin > Settings > Exam countdown (title, date, optional time). */
(function(){var C=window.AGRI_CFG,box=document.getElementById('agri-cd');if(!C||!box)return;
function pad(n){return(n<10?'0':'')+n}
function parse(x){var tm=x.time&&/^\d\d:\d\d$/.test(x.time)?x.time:'',d=new Date((x.date||'')+'T'+(tm||'00:00')+':00');return{t:String(x.title||''),at:d,timed:!!tm,ok:!isNaN(d)&&!!x.title}}
function label(o,now){var ms=o.at-now;
 if(ms>0){var s=Math.floor(ms/1000),d=Math.floor(s/86400),h=Math.floor(s%86400/3600),m=Math.floor(s%3600/60);return(d>0?d+(d==1?' day ':' days '):'')+pad(h)+':'+pad(m)+':'+pad(s%60)+' left: '+o.t}
 if(!o.timed&&-ms<864e5)return'Today: '+o.t;
 if(o.timed&&-ms<72e5)return'Started: '+o.t;return null}
fetch(C.url+'/rest/v1/site_settings?select=value&key=eq.countdown',{headers:{apikey:C.key,Authorization:'Bearer '+C.key}}).then(function(r){return r.ok?r.json():[]}).then(function(a){
 var it=(a[0]&&a[0].value&&a[0].value.items)||[],now=new Date();
 var L=it.map(parse).filter(function(o){return o.ok&&label(o,now)}).sort(function(a,b){return a.at-b.at}).slice(0,3);
 if(!L.length)return;
 box.setAttribute('style','position:relative;z-index:1;margin:70px auto -40px;max-width:1100px;padding:0 16px;display:flex;gap:10px;flex-wrap:wrap;justify-content:center');
 var els=L.map(function(o){var d=document.createElement('div');d.setAttribute('style','background:#0f6b4f;color:#fff;border-radius:999px;padding:8px 18px;font:600 15px system-ui,sans-serif;box-shadow:0 4px 14px rgba(0,0,0,.18);font-variant-numeric:tabular-nums');d.setAttribute('role','timer');box.appendChild(d);return d});
 function tick(){var n=new Date(),any=false;L.forEach(function(o,i){var t=label(o,n);if(t==null){els[i].style.display='none'}else{any=true;if(els[i].textContent!==t)els[i].textContent=t}});if(!any)clearInterval(iv)}
 tick();var iv=setInterval(tick,1000)}).catch(function(){})})();
