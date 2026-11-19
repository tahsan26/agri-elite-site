/* AGRi Elite Arena - Student Portal "Study Hub": course notes, lecture videos and PDFs inside the portal.
   Loaded after portal-x.js and before the main portal script. It wraps window.AgriPortalExt and
   window.AgriDashExtra, so the features from portal-x.js keep working. Plain JS, no build step. */
(function(){
var prevExt=window.AgriPortalExt;
window.AgriPortalExt=function(X){
 try{if(prevExt)prevExt(X)}catch(e){console.error(e)}
 var sb=X.sb,V=X.V,$=X.$,esc=X.esc;
 var css=document.createElement('style');css.textContent=
 '.h-tabs{display:flex;gap:6px;flex-wrap:wrap;margin:6px 0 4px}.h-tabs button{font:inherit;font-weight:700;border:1.5px solid var(--line);background:var(--card);color:var(--fg);border-radius:999px;padding:7px 15px;cursor:pointer}.h-tabs button.on{background:var(--g);border-color:var(--g);color:#fff}'+
 '.h-hero{background:radial-gradient(120% 140% at 0 0,#14c58a 0,#0f6b4f 50%,#06291f 100%);color:#fff;border:0}.h-hero h3{margin:2px 0 4px;font-size:22px}.h-hero .m{color:rgba(255,255,255,.85)}'+
 '.h-pr{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:8px;margin:12px 0}.h-pr div{background:rgba(255,255,255,.13);border:1px solid rgba(255,255,255,.22);border-radius:12px;padding:8px;text-align:center}.h-pr b{display:block;font-size:20px}.h-pr span{font-size:12px;opacity:.88}'+
 '.h-bar{height:7px;border-radius:99px;background:rgba(255,255,255,.22);overflow:hidden}.h-bar i{display:block;height:100%;background:linear-gradient(90deg,#fcd34d,#f59e0b)}'+
 '.h-act{display:flex;gap:8px;flex-wrap:wrap;margin-top:12px}.h-act a{text-decoration:none;font-weight:700;border-radius:999px;padding:8px 14px;font-size:14px}.h-act .p{background:#fff;color:#0a4a37}.h-act .s{background:rgba(255,255,255,.16);color:#fff;border:1px solid rgba(255,255,255,.3)}'+
 '.h-vg{display:grid;grid-template-columns:repeat(auto-fill,minmax(230px,1fr));gap:12px}.h-v{border:1px solid var(--line);border-radius:16px;overflow:hidden;background:var(--card);cursor:pointer;text-align:left;padding:0;font:inherit;color:var(--fg);transition:transform .15s,box-shadow .15s}.h-v:hover{transform:translateY(-2px);box-shadow:0 10px 24px rgba(0,0,0,.1)}'+
 '.h-th{position:relative;aspect-ratio:16/9;background:#0f6b4f center/cover no-repeat}.h-th::after{content:"";position:absolute;left:50%;top:50%;width:54px;height:54px;margin:-27px 0 0 -27px;border-radius:50%;background:rgba(226,85,61,.92) url("data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%270 0 24 24%27%3E%3Cpath fill=%27white%27 d=%27M8 5v14l11-7z%27/%3E%3C/svg%3E") center/26px no-repeat;box-shadow:0 6px 16px rgba(0,0,0,.3)}'+
 '.h-v b{display:block;padding:10px 12px 2px;font-size:15px;line-height:1.35}.h-v small{display:block;padding:0 12px 12px;color:var(--mute);font-size:12.5px}'+
 '.h-cg{display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:10px}.h-c{border:1px solid var(--line);border-radius:14px;padding:12px;background:var(--card)}.h-c .cd{font-weight:800;font-size:20px;color:var(--g)}.h-c .m{font-size:13px}.h-c .x-row{margin-top:8px}'+
 '.h-tag{display:inline-block;font-size:11.5px;font-weight:800;letter-spacing:.05em;text-transform:uppercase;border-radius:999px;padding:2px 9px;background:var(--mint);color:var(--g)}.h-tag.ar{background:var(--line);color:var(--mute)}'+
 '.h-pdf{display:flex;align-items:center;gap:10px;border:1px solid var(--line);border-radius:14px;padding:10px 12px;background:var(--card);margin:8px 0}.h-pdf .ic{flex:none;width:38px;height:46px;border-radius:8px;background:linear-gradient(160deg,#ef6b57,#c62828);color:#fff;font:800 11px system-ui;display:flex;align-items:flex-end;justify-content:center;padding-bottom:6px}.h-pdf .t{flex:1;min-width:0}.h-pdf .t b{display:block;font-size:14.5px}.h-pdf .t span{font-size:12.5px;color:var(--mute)}.h-pdf a{text-decoration:none;font-weight:700;font-size:13px;border-radius:999px;padding:6px 11px;white-space:nowrap}.h-pdf .r{background:var(--g);color:#fff}.h-pdf .d{background:var(--card);color:var(--fg);border:1px solid var(--line)}'+
 '.h-mod{position:fixed;inset:0;z-index:90;background:rgba(4,20,15,.82);display:flex;align-items:center;justify-content:center;padding:16px}.h-mod .in{width:min(960px,100%)}.h-mod .fr{position:relative;aspect-ratio:16/9;background:#000;border-radius:14px;overflow:hidden}.h-mod iframe{position:absolute;inset:0;width:100%;height:100%;border:0}.h-mod .tb{display:flex;justify-content:space-between;align-items:center;gap:10px;color:#fff;margin-bottom:10px}.h-mod .tb b{font-size:15px}.h-mod button{font:inherit;font-weight:700;border:0;border-radius:999px;padding:7px 14px;cursor:pointer;background:#fff;color:#0a4a37}'+
 '.h-dv{display:flex;gap:10px;overflow-x:auto;padding-bottom:4px;scroll-snap-type:x mandatory}.h-dv .h-v{flex:0 0 220px;scroll-snap-align:start}'+
 '@media(max-width:560px){.h-vg{grid-template-columns:1fr 1fr;gap:8px}.h-v b{font-size:13px;padding:8px 9px 2px}.h-v small{padding:0 9px 9px;font-size:11.5px}.h-th::after{width:40px;height:40px;margin:-20px 0 0 -20px;background-size:20px}.h-cg{grid-template-columns:1fr 1fr}.h-c{padding:10px}.h-c .btn{padding:7px 10px;font-size:13px}.h-pdf{gap:8px;padding:9px 10px}.h-pdf .t b{font-size:13.5px}.h-pdf .ic{width:32px;height:40px}.h-pdf a{padding:6px 9px}.h-dv .h-v{flex-basis:200px}}';
 document.head.appendChild(css);

 var CAT={study:'Learn with video',campus:'Campus life'};
 function ls(k){try{return JSON.parse(localStorage.getItem(k)||'null')}catch(e){return null}}
 function yid(u){var m=/(?:youtu\.be\/|v=|embed\/|shorts\/)([\w-]{11})/.exec(u||'');return m?m[1]:''}
 var mediaCache=null;
 async function media(){if(mediaCache)return mediaCache;var r=await sb.from('site_settings').select('value').eq('key','media');var it=(r.data&&r.data[0]&&r.data[0].value&&r.data[0].value.items)||[];
  mediaCache=it.filter(function(x){return x&&x.t=='video'&&yid(x.url)}).map(function(x){return{id:yid(x.url),title:x.title||'Video',c:x.c||'study',url:x.url}});return mediaCache}
 function vcard(v){return'<button type="button" class="h-v" data-vid="'+v.id+'" data-vt="'+esc(v.title)+'"><div class="h-th" style="background-image:url(https://i.ytimg.com/vi/'+v.id+'/hqdefault.jpg)"></div><b>'+esc(v.title)+'</b><small>'+esc(CAT[v.c]||v.c)+' · watch here</small></button>'}
 function play(id,t){var d=document.createElement('div');d.className='h-mod';d.setAttribute('role','dialog');d.setAttribute('aria-modal','true');
  d.innerHTML='<div class="in"><div class="tb"><b>'+esc(t)+'</b><button type="button">✕ Close</button></div><div class="fr"><iframe src="https://www.youtube-nocookie.com/embed/'+id+'?autoplay=1&rel=0&modestbranding=1" allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowfullscreen title="'+esc(t)+'"></iframe></div><p style="color:#cfe;font-size:13px;margin:8px 2px">ভিডিও না চললে <a style="color:#fcd34d" href="https://youtu.be/'+id+'" target="_blank" rel="noopener">YouTube-এ খুলো</a>।</p></div>';
  function close(){d.remove();document.removeEventListener('keydown',k)}function k(e){if(e.key=='Escape')close()}
  d.onclick=function(e){if(e.target==d||e.target.closest('.tb button'))close()};document.addEventListener('keydown',k);document.body.appendChild(d)}
 document.addEventListener('click',function(e){var b=e.target.closest('[data-vid]');if(b&&b.closest('#main')){e.preventDefault();play(b.dataset.vid,b.dataset.vt||'Video')}});

 function prog(){function al(k){var v=ls(k);return Array.isArray(v)?v.length:0}var done=al('agn101done'),bm=al('agn101bm'),b=ls('agn101best'),best=b&&b.n>0&&b.s>=0?Math.round(100*b.s/b.n)+'%':'—';return{done:Math.min(done,42),bm:bm,best:best,pct:Math.round(Math.min(done,42)/42*100)}}
 function heroCard(){var p=prog();return'<div class="card h-hero"><span class="h-tag" style="background:rgba(255,255,255,.18);color:#fff">Live now</span><h3>AGN 101 · Fundamentals of Agronomy</h3><div class="m">৬টি প্রশ্নপত্রের ৪২টি প্রশ্ন, উত্তর আর বাংলা সারাংশ। তোমার অগ্রগতি এই ডিভাইসে সেভ থাকে।</div>'+
  '<div class="h-pr"><div><b>'+p.done+'/42</b><span>পড়া শেষ</span></div><div><b>'+p.bm+'</b><span>বুকমার্ক</span></div><div><b>'+p.best+'</b><span>সেরা টেস্ট</span></div></div><div class="h-bar"><i style="width:'+p.pct+'%"></i></div>'+
  '<div class="h-act"><a class="p" href="agn101.html">'+(p.done?'পড়া চালিয়ে যাও':'নোট পড়া শুরু করো')+'</a><a class="s" href="agn101.html#test">Self-test</a><a class="s" href="agn101.html#papers">Year-wise papers</a></div></div>'}
 var COURSES=[['AGF 101','Fundamentals of Environmental Science','agf101.html',1],['SSC 101','Introductory Soil Science','ssc101.html',1],['SOC 101','Rural Sociology','soc101.html',0]];
 var PDFS=[['AGN 101 · Question Analysis','9 pages · 1.7 MB','AGN101_Analysis.pdf'],['AGN 101 · All Answers','22 pages · 3.1 MB','AGN101_Answers.pdf'],['AGN 101 · All Question Papers','6 pages · 0.2 MB','AGN101_All_Question_Papers.pdf'],['AGN 101 · Analysis (black & white, print)','0.3 MB','AGN101_Analysis_BW.pdf'],['AGN 101 · Answers (black & white, print)','0.6 MB','AGN101_Answers_BW.pdf'],['Exam Routine · L-1 S-1 2026','0.6 MB','Exam_Routine_L1S1_2026.pdf'],['Website Guide · How to use','1 page · 0.2 MB','AGRi_Elite_Arena_Guide.pdf']];
 var ARC=[['AGF 101 · Question Analysis','4.3 MB','AGF101_Analysis.pdf'],['AGF 101 · All Answers','5.0 MB','AGF101_Answers.pdf'],['SSC 101 · Question Analysis','6.3 MB','SSC101_Analysis.pdf'],['SSC 101 · All Answers','10.1 MB','SSC101_Answers.pdf'],['SOC 101 · Question Analysis','4.1 MB','SOC101_Analysis.pdf'],['SOC 101 · All Answers','7.7 MB','SOC101_Answers.pdf']];
 function pdfRow(x){return'<div class="h-pdf"><div class="ic">PDF</div><div class="t"><b>'+esc(x[0])+'</b><span>'+esc(x[1])+'</span></div><a class="r" href="'+x[2]+'" target="_blank" rel="noopener">👁 Read</a><a class="d" href="'+x[2]+'" download>⬇</a></div>'}

 V.hub=async function(){
  document.title='Study Hub · AGRi Student Portal';
  var tab=(V.hub.tab||'all'),vids=[];try{vids=await media()}catch(e){}
  var study=vids.filter(function(v){return v.c=='study'}),other=vids.filter(function(v){return v.c!='study'});
  var notes='<div class="card"><div class="x-row" style="justify-content:space-between"><b>📘 Course notes</b><span class="m">ক্লিক করলেই নোট খুলবে</span></div>'+heroCard()+
   '<div class="h-cg">'+COURSES.map(function(c){return'<div class="h-c"><span class="h-tag ar">Archive</span><div class="cd">'+c[0]+'</div><div class="m">'+c[1]+'</div><div class="x-row"><a class="btn s" style="text-decoration:none" href="'+c[2]+'">Open notes</a>'+(c[3]?'<a class="btn s" style="text-decoration:none" href="'+c[2]+'#test">Self-test</a>':'')+'</div></div>'}).join('')+'</div>'+
   '<p class="m" style="margin:10px 0 0">লাইভ নোট (শিক্ষকদের আপলোড করা) দেখতে <a href="#" data-hg="notes">Notes</a> ট্যাবে যাও।</p></div>';
  var videos='<div class="card"><div class="x-row" style="justify-content:space-between"><b>🎬 Lecture videos</b><span class="m">'+vids.length+'টি ভিডিও · এখানেই চলবে</span></div>'+
   (study.length?'<h4 style="margin:12px 0 8px">Learn with video</h4><div class="h-vg">'+study.map(vcard).join('')+'</div>':'')+
   (other.length?'<h4 style="margin:16px 0 8px">Campus life</h4><div class="h-vg">'+other.map(vcard).join('')+'</div>':'')+
   (vids.length?'':'<p class="m">এখনো কোনো ভিডিও নেই।</p>')+'</div>';
  var pdfs='<div class="card"><b>📄 PDF notes</b><p class="m" style="margin:4px 0 6px">Read চাপলে নতুন ট্যাবে খুলবে, ⬇ চাপলে ডাউনলোড।</p>'+PDFS.map(pdfRow).join('')+
   '<details style="margin-top:10px"><summary style="cursor:pointer;font-weight:700">আর্কাইভ PDF (AGF, SSC, SOC) · '+ARC.length+'টি</summary>'+ARC.map(pdfRow).join('')+'</details></div>';
  var T=[['all','সব'],['notes','📘 Notes'],['videos','🎬 Videos'],['pdfs','📄 PDFs']];
  $('main').innerHTML='<h2 style="margin-bottom:2px">Study Hub</h2><p class="m" style="margin:0 0 6px">নোট, ভিডিও আর PDF, সব এক জায়গায়।</p><div class="h-tabs" id="htabs">'+T.map(function(t){return'<button type="button" data-ht="'+t[0]+'" class="'+(t[0]==tab?'on':'')+'">'+t[1]+'</button>'}).join('')+'</div>'+
   (tab=='all'?notes+videos+pdfs:tab=='notes'?notes:tab=='videos'?videos:pdfs);
  $('htabs').onclick=function(e){var b=e.target.closest('[data-ht]');if(!b)return;V.hub.tab=b.dataset.ht;X.go('hub')};
  var l=$('main').querySelector('[data-hg]');if(l)l.onclick=function(e){e.preventDefault();X.go(l.dataset.hg)};
 };

 /* dashboard: AGN 101 progress + latest videos */
 var prevDash=window.AgriDashExtra;
 window.AgriDashExtra=function(){
  try{if(prevDash)prevDash()}catch(e){console.error(e)}
  var m=$('main');if(!m||m.querySelector('#h-dash'))return;
  var d=document.createElement('div');d.id='h-dash';
  d.innerHTML=heroCard()+'<div class="card" id="h-dv" hidden><div class="x-row" style="justify-content:space-between"><b>🎬 নতুন ভিডিও</b><a href="#" data-hgo="hub" class="m" style="font-weight:700;color:var(--g)">Study Hub-এ সব দেখো ›</a></div><div class="h-dv" style="margin-top:10px"></div></div>';
  d.addEventListener('click',function(e){var a=e.target.closest('[data-hgo]');if(a){e.preventDefault();V.hub.tab='videos';X.go('hub')}});
  m.insertBefore(d,m.children[1]||null);
  media().then(function(v){var s=v.filter(function(x){return x.c=='study'}).slice(0,4);if(!s.length)return;var c=$('h-dv');if(!c)return;c.querySelector('.h-dv').innerHTML=s.map(vcard).join('');c.hidden=false}).catch(function(){});
 };
};
})();
