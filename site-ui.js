/* AGRi Elite Arena - shared site UI controlled from the admin panel (Admin > Home page):
   1) mobile bottom navigation bar (Home, Notes, Videos, PDFs, Portal)
   2) home page sections the admin chose to hide.
   Settings live in site_settings key "home" and are cached on the device so the page does not flicker. */
(function(){
var C=window.AGRI_CFG,D=document,KEY='agri-home-ui';
function cached(){try{return JSON.parse(localStorage.getItem(KEY)||'null')||{}}catch(e){return{}}}
var S=cached(),isHome=/\/(index\.html)?$/.test(location.pathname);

/* ---------- styles ---------- */
var css=D.createElement('style');css.textContent=
'.admhide{display:none!important}main section[id]{scroll-margin-top:84px}a:focus-visible,button:focus-visible,input:focus-visible,select:focus-visible,summary:focus-visible{outline:3px solid #f0a93a!important;outline-offset:2px}#skipc{position:fixed;left:12px;top:-60px;z-index:2147483600;background:#0f6b4f;color:#fff;padding:10px 16px;border-radius:10px;font:700 14px system-ui;text-decoration:none;transition:top .15s}#skipc:focus{top:12px}'+
'#bnav{display:none}'+
'@media(max-width:760px){'+
' body.has-bnav{padding-bottom:calc(66px + env(safe-area-inset-bottom,0px))}'+
' #bnav{display:grid;grid-template-columns:repeat(5,1fr);position:fixed;left:0;right:0;bottom:0;z-index:2147482500;background:rgba(255,255,255,.96);-webkit-backdrop-filter:blur(14px);backdrop-filter:blur(14px);border-top:1px solid #dbe4e1;padding:6px 4px calc(6px + env(safe-area-inset-bottom,0px));box-shadow:0 -6px 20px rgba(6,41,31,.08)}'+
' #bnav a{display:flex;flex-direction:column;align-items:center;gap:3px;text-decoration:none;color:#5b6b77;font:700 11.5px/1.1 "Hind Siliguri",system-ui,sans-serif;padding:4px 2px;border-radius:12px;min-height:48px;justify-content:center}'+
' #bnav a svg{width:23px;height:23px;fill:none;stroke:currentColor;stroke-width:2;stroke-linecap:round;stroke-linejoin:round}'+
' #bnav a.on{color:#0f6b4f}#bnav a.on svg{stroke-width:2.4}#bnav a.on i{background:#d9f3e7}'+
' #bnav i{display:flex;align-items:center;justify-content:center;width:46px;height:28px;border-radius:999px;transition:background .2s}'+
' #bnav a:active i{background:#e7f5ee}'+
' body.has-bnav #thm,body.has-bnav #ux-up,body.has-bnav #aiw-b,body.has-bnav #aiw-bx{margin-bottom:calc(64px + env(safe-area-inset-bottom,0px))!important}'+
' body.has-bnav #aiw-p{margin-bottom:calc(60px + env(safe-area-inset-bottom,0px))!important;max-height:calc(100vh - 100px)!important}'+
' html[data-theme=dark] #bnav{background:rgba(14,22,20,.95);border-top-color:#26372f}html[data-theme=dark] #bnav a{color:#93a6a0}html[data-theme=dark] #bnav a.on{color:#7ee7c7}html[data-theme=dark] #bnav a.on i{background:#17352b}'+
'}'+
'@media print{#bnav{display:none!important}}';
D.head.appendChild(css);

/* ---------- bottom nav ---------- */
var I={home:'<path d="M3 11 12 4l9 7"/><path d="M5 10v10h5v-6h4v6h5V10"/>',notes:'<path d="M2 4h6a4 4 0 0 1 4 4v12a3 3 0 0 0-3-3H2z"/><path d="M22 4h-6a4 4 0 0 0-4 4v12a3 3 0 0 1 3-3h7z"/>',vid:'<rect x="3" y="6" width="13" height="12" rx="2"/><path d="m16 10 5-3v10l-5-3"/>',pdf:'<path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"/><path d="M14 3v5h5M9 13h6M9 17h6"/>',find:'<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>',me:'<circle cx="12" cy="8" r="4"/><path d="M4 21c1-4.5 4.5-7 8-7s7 2.5 8 7"/>'};
function nav(){
 if(S.bnav===false||D.getElementById('bnav')||!D.body)return;
 var live=S.live||'agn101.html',p=location.pathname.split('/').pop()||'index.html';
 var L=[['home','হোম',isHome?'#top':'index.html'],['notes','নোট',live],['find','খুঁজুন','#search'],['vid','ভিডিও',isHome?'#learn':'index.html#learn'],['me','পোর্টাল','portal.html']];
 var n=D.createElement('nav');n.id='bnav';n.setAttribute('aria-label','Main');
 n.innerHTML=L.map(function(x){var on=(x[0]=='home'&&isHome)||(x[0]=='notes'&&p==live.split('#')[0]);
  return'<a href="'+x[2]+'" data-k="'+x[0]+'"'+(on?' class="on" aria-current="page"':'')+'><i><svg viewBox="0 0 24 24" aria-hidden="true">'+I[x[0]]+'</svg></i>'+x[1]+'</a>'}).join('');
 n.addEventListener('click',function(e){var a=e.target.closest('a');if(!a)return;var h=a.getAttribute('href');
  if(h=='#top'){e.preventDefault();scrollTo({top:0,behavior:'smooth'});return}if(h=='#search'){e.preventDefault();openSearch();return}
  if(h.charAt(0)=='#'){var t=D.querySelector(h);if(t){e.preventDefault();if(t.hidden&&h=='#learn'){t=D.getElementById('media')&&!D.getElementById('media').hidden?D.getElementById('media'):t}t.scrollIntoView({behavior:'smooth',block:'start'});history.replaceState(null,'',h)}}});
 D.body.appendChild(n);D.body.classList.add('has-bnav');
 if(isHome){var secs=['learn'];var io='IntersectionObserver' in window?new IntersectionObserver(function(es){es.forEach(function(e){if(!e.isIntersecting)return;var k=e.target.id=='learn'?'vid':'';n.querySelectorAll('a').forEach(function(a){a.classList.toggle('on',a.dataset.k==k)})})},{rootMargin:'-45% 0px -50% 0px'}):null;
  if(io)D.querySelectorAll('main section[id]').forEach(function(s){io.observe(s)});
  addEventListener('scroll',function(){if(scrollY<300)n.querySelectorAll('a').forEach(function(a){a.classList.toggle('on',a.dataset.k=='home')})},{passive:true})}
}
function hide(){if(!isHome)return;var h=S.hide||[];D.querySelectorAll('main > section[id], main section[id]').forEach(function(s){s.classList.toggle('admhide',h.indexOf(s.id)>-1)})}
function skip(){if(D.getElementById('skipc')||!D.body)return;var m=D.querySelector('main');if(!m)return;if(!m.id)m.id='main-c';if(!m.hasAttribute('tabindex'))m.setAttribute('tabindex','-1');var a=D.createElement('a');a.id='skipc';a.href='#'+m.id;a.textContent='Skip to content';D.body.insertBefore(a,D.body.firstChild)}
var sig='';function apply(){skip();setTimeout(qotd,600);setTimeout(plan,900);homeExtras();setTimeout(aiChips,2500);setTimeout(aiChips,5000);hide();var k=JSON.stringify([S.bnav,S.live]);var n=D.getElementById('bnav');if(n&&k!==sig){n.remove();D.body.classList.remove('has-bnav')}sig=k;if(S.bnav!==false)nav()}
if(D.readyState=='loading')D.addEventListener('DOMContentLoaded',apply);else apply();
setTimeout(hide,1500);setTimeout(hide,4000);


/* ---------- search everywhere (bottom bar, Ctrl+K or "/") ---------- */
var IDX=null,VIDS=null;
function esc(t){return String(t==null?'':t).replace(/[&<>"]/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]})}
function loadIdx(){if(IDX)return Promise.resolve(IDX);return fetch('search-index.json').then(function(r){return r.json()}).then(function(j){IDX=j;return j})}
function loadVids(){if(VIDS||!C||!C.url)return Promise.resolve(VIDS||[]);return fetch(C.url+'/rest/v1/site_settings?select=value&key=eq.media',{headers:{apikey:C.key,Authorization:'Bearer '+C.key}}).then(function(r){return r.ok?r.json():[]}).then(function(a){var it=(a&&a[0]&&a[0].value&&a[0].value.items)||[];VIDS=it.filter(function(x){return x&&x.t=='video'&&x.url}).map(function(x){return[x.title||'Video',x.url,x.c||'']});return VIDS}).catch(function(){return[]})}
var scss=D.createElement('style');scss.textContent=
'#srch{position:fixed;inset:0;z-index:2147483300;background:rgba(4,20,15,.55);-webkit-backdrop-filter:blur(4px);backdrop-filter:blur(4px);display:none;align-items:flex-start;justify-content:center;padding:max(14px,env(safe-area-inset-top,0px)) 12px 12px}#srch.on{display:flex}'+
'#srch input:focus-visible{outline:0!important}#srch .sb{width:min(680px,100%);max-height:calc(100vh - 28px);display:flex;flex-direction:column;background:#fff;color:#14202b;border-radius:20px;box-shadow:0 24px 60px rgba(0,0,0,.35);overflow:hidden;font-family:"Hind Siliguri",system-ui,sans-serif}'+
'#srch .sh{display:flex;align-items:center;gap:10px;padding:12px 14px;border-bottom:1px solid #e3ebe7}#srch .sh svg{width:22px;height:22px;stroke:#0f6b4f;fill:none;stroke-width:2.2;flex:none}'+
'#srch input{flex:1;min-width:0;border:0;outline:0;font:600 17px "Hind Siliguri",system-ui,sans-serif;background:transparent;color:inherit;padding:6px 0}#srch .sx{border:0;background:#eef4f1;color:#0f6b4f;border-radius:999px;padding:6px 12px;font:700 13px system-ui;cursor:pointer}'+
'#srch .sr{overflow:auto;padding:6px 8px 12px}#srch h6{margin:12px 8px 6px;font:800 11.5px system-ui;letter-spacing:.1em;text-transform:uppercase;color:#5b6b77}'+
'#srch .it{display:flex;gap:10px;align-items:flex-start;padding:10px;border-radius:12px;text-decoration:none;color:inherit}#srch .it:hover,#srch .it.sel{background:#eef7f2}#srch .ic{flex:none;width:34px;height:34px;border-radius:10px;display:flex;align-items:center;justify-content:center;font-size:17px;background:#e7f5ee}'+
'#srch .it b{display:block;font-size:14.5px;line-height:1.35;font-weight:700}#srch .it small{display:block;color:#5b6b77;font-size:12.5px;line-height:1.4;margin-top:2px}#srch mark{background:#fff1c7;color:inherit;border-radius:3px;padding:0 1px}'+
'#srch .chips{display:flex;flex-wrap:wrap;gap:6px;padding:4px 8px}#srch .chips button{border:1px solid #dbe4e1;background:#fff;border-radius:999px;padding:6px 12px;font:600 13.5px "Hind Siliguri",system-ui;cursor:pointer;color:#0f6b4f}'+
'#srch .em{padding:22px 12px;text-align:center;color:#5b6b77;font-size:14.5px}#srch .ft{border-top:1px solid #e3ebe7;padding:8px 14px;font:12px system-ui;color:#5b6b77;display:flex;justify-content:space-between;gap:8px}'+
'#srch .st{display:inline-block;font:800 10.5px system-ui;color:#8a5a00;background:#fff4dc;border-radius:999px;padding:1px 7px;margin-left:6px;vertical-align:middle}'+
'html[data-theme=dark] #srch .sb{background:#13201b;color:#e6efec}html[data-theme=dark] #srch .it:hover,html[data-theme=dark] #srch .it.sel{background:#1b2e27}html[data-theme=dark] #srch .ic{background:#17352b}html[data-theme=dark] #srch .chips button{background:#13201b;border-color:#26372f;color:#7ee7c7}html[data-theme=dark] #srch .sh,html[data-theme=dark] #srch .ft{border-color:#26372f}html[data-theme=dark] #srch mark{background:#5a4510}'+
'@media(max-width:560px){#srch{padding:0;background:#fff}#srch .sb{border-radius:0;max-height:100vh;height:100%;box-shadow:none}html[data-theme=dark] #srch{background:#13201b}}';
D.head.appendChild(scss);
var box,inp,res,sel=-1;
function hl(t,ws){t=esc(t);ws.forEach(function(w){if(w.length<2)return;t=t.replace(new RegExp('('+w.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')+')','ig'),'<mark>$1</mark>')});return t}
function recent(){try{return JSON.parse(localStorage.getItem('agri-srch')||'[]')}catch(e){return[]}}
function remember(q){q=q.trim();if(q.length<2)return;var r=recent().filter(function(x){return x!=q});r.unshift(q);try{localStorage.setItem('agri-srch',JSON.stringify(r.slice(0,6)))}catch(e){}}
function draw(){var q=inp.value.trim().toLowerCase(),ws=q.split(/\s+/).filter(Boolean),h='';sel=-1;
 if(!IDX){res.innerHTML='<div class="em">লোড হচ্ছে…</div>';return}
 if(!ws.length){var r=recent();h+=(r.length?'<h6>সাম্প্রতিক খোঁজ</h6><div class="chips">'+r.map(function(x){return'<button type="button" data-q="'+esc(x)+'">↺ '+esc(x)+'</button>'}).join('')+'</div>':'')+
  '<h6>জনপ্রিয় টপিক</h6><div class="chips">'+Object.keys(IDX.topics).map(function(k){return'<button type="button" data-q="'+esc(IDX.topics[k])+'">'+esc(IDX.topics[k])+'</button>'}).join('')+'</div>'+
  '<h6>দ্রুত যাও</h6>'+IDX.pages.slice(0,5).map(function(p){return it('📌',p[1],p[0],'',[])}).join('');res.innerHTML=h;return}
 function m(t){t=String(t||'').toLowerCase();return ws.every(function(w){return t.indexOf(w)>-1})}
 var qs=IDX.q.filter(function(x){return m(x.q+' '+x.bq+' '+(IDX.topics[x.t]||'')+' '+x.id+' '+x.y.join(' '))}).sort(function(a,b){return b.c-a.c}).slice(0,8);
 var vs=(VIDS||[]).filter(function(v){return m(v[0])}).slice(0,4),ps=IDX.pdf.filter(function(p){return m(p[0]+' '+p[1])}).slice(0,4),pg=IDX.pages.filter(function(p){return m(p[0]+' '+p[2])}).slice(0,4);
 if(qs.length)h+='<h6>AGN 101 প্রশ্ন ও উত্তর</h6>'+qs.map(function(x){return it('❓','agn101.html#'+x.id,x.q,(IDX.topics[x.t]||'')+(x.y.length?' · '+x.y.map(function(y){return y.replace('I',' Imp')}).join(', '):'')+(x.c>=3?'<span class="st">★ '+x.c+'×</span>':''),ws,x.bq)}).join('');
 if(vs.length)h+='<h6>ভিডিও</h6>'+vs.map(function(v){return it('🎬',v[1],v[0],'YouTube-এ চলবে',ws,'',1)}).join('');
 if(ps.length)h+='<h6>PDF</h6>'+ps.map(function(p){return it('📄',p[1],p[0],'চাপলে PDF খুলবে',ws,'',1)}).join('');
 if(pg.length)h+='<h6>পেজ</h6>'+pg.map(function(p){return it('📌',p[1],p[0],'',ws)}).join('');
 h+='<a class="it" href="agn101.html?q='+encodeURIComponent(inp.value.trim())+'"><span class="ic">🔎</span><span><b>AGN 101 নোটের ভেতরে "'+esc(inp.value.trim())+'" খোঁজো</b><small>সব উত্তরের লেখার মধ্যে খুঁজবে</small></span></a>';
 if(!qs.length&&!vs.length&&!ps.length&&!pg.length)h='<div class="em">কিছু পাওয়া যায়নি। ইংরেজি শব্দে চেষ্টা করো (যেমন tillage, irrigation)।</div>'+h;
 res.innerHTML=h}
function it(ic,href,t,sub,ws,bq,nw){return'<a class="it" href="'+esc(href)+'"'+(nw?' target="_blank" rel="noopener"':'')+'><span class="ic">'+ic+'</span><span><b>'+hl(t,ws)+'</b>'+(bq?'<small>'+hl(bq,ws)+'</small>':'')+(sub?'<small>'+sub+'</small>':'')+'</span></a>'}
function build(){box=D.createElement('div');box.id='srch';box.setAttribute('role','dialog');box.setAttribute('aria-modal','true');box.setAttribute('aria-label','Search');
 box.innerHTML='<div class="sb"><div class="sh"><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg><input type="search" placeholder="প্রশ্ন, টপিক, ভিডিও বা PDF খোঁজো…" aria-label="Search" autocomplete="off"><button type="button" class="sx">বন্ধ</button></div><div class="sr"></div><div class="ft"><span>↑↓ বাছাই · Enter খোলো · Esc বন্ধ</span><span>Ctrl + K</span></div></div>';
 D.body.appendChild(box);inp=box.querySelector('input');res=box.querySelector('.sr');
 inp.addEventListener('input',draw);
 box.addEventListener('click',function(e){if(e.target==box||e.target.closest('.sx'))return closeSearch();var c=e.target.closest('[data-q]');if(c){inp.value=c.dataset.q;draw();inp.focus();return}var a=e.target.closest('a.it');if(a){remember(inp.value);var h=a.getAttribute('href');if(h.charAt(0)=='#'||(isHome&&/^index\.html#/.test(h))){closeSearch()}}});
 inp.addEventListener('keydown',function(e){var L=res.querySelectorAll('a.it');if(e.key=='ArrowDown'||e.key=='ArrowUp'){e.preventDefault();if(!L.length)return;sel=(sel+(e.key=='ArrowDown'?1:-1)+L.length)%L.length;L.forEach(function(x,i){x.classList.toggle('sel',i==sel)});L[sel].scrollIntoView({block:'nearest'})}else if(e.key=='Enter'){var t=L[sel>-1?sel:0];if(t){remember(inp.value);t.click()}}})}
function openSearch(){if(!D.body)return;if(!box)build();box.classList.add('on');D.documentElement.style.overflow='hidden';inp.value='';draw();setTimeout(function(){inp.focus()},30);loadIdx().then(draw).catch(function(){res.innerHTML='<div class="em">খোঁজার তালিকা লোড হয়নি। ইন্টারনেট চেক করো।</div>'});loadVids().then(function(){if(inp.value)draw()})}
function closeSearch(){if(box){box.classList.remove('on');D.documentElement.style.overflow=''}}
window.AgriSearch={open:openSearch,close:closeSearch};
D.addEventListener('keydown',function(e){var tg=e.target,typing=tg&&(/^(INPUT|TEXTAREA|SELECT)$/.test(tg.tagName)||tg.isContentEditable);
 if((e.ctrlKey||e.metaKey)&&(e.key=='k'||e.key=='K')){e.preventDefault();openSearch()}else if(e.key=='/'&&!typing){e.preventDefault();openSearch()}else if(e.key=='Escape'&&box&&box.classList.contains('on'))closeSearch()});
if(location.hash=='#search')setTimeout(openSearch,300);

/* ---------- question of the day (home) ---------- */
function qotd(){if(!isHome||S.qotd===false||D.getElementById('qotd'))return;var h=D.querySelector('.hcta');if(!h)return;
 loadIdx().then(function(j){if(D.getElementById('qotd'))return;var L=j.q.slice().sort(function(a,b){return a.id<b.id?-1:1}),day=Math.floor((Date.now()+6*36e5)/864e5),off=0;
  function pick(){return L[(day+off)%L.length]}
  var c=D.createElement('div');c.id='qotd';
  function paint(){var x=pick();c.innerHTML='<div class="qh"><span class="qb">🎯 আজকের প্রশ্ন</span><span class="qt">'+esc(j.topics[x.t]||'')+(x.c>=2?' · ★ '+x.c+' বার এসেছে':'')+'</span></div><p class="qq">'+esc(x.q)+'</p><p class="qbq">'+esc(x.bq)+'</p><div class="qa"><a class="qp" href="agn101.html#'+x.id+'">উত্তর দেখো ›</a><button type="button" class="qn">আরেকটা প্রশ্ন ↻</button><button type="button" class="qs" data-qid="'+x.id+'" aria-label="Share">শেয়ার ↗</button></div>'}
  paint();c.addEventListener('click',function(e){if(e.target.closest('.qn')){off++;paint()}var sh=e.target.closest('.qs');if(sh){var x=pick(),u=location.origin+'/agn101.html#'+x.id,t='আজকের প্রশ্ন (AGN 101): '+x.q;if(navigator.share)navigator.share({title:'AGRi Elite Arena',text:t,url:u}).catch(function(){});else if(navigator.clipboard)navigator.clipboard.writeText(t+'\n'+u).then(function(){sh.textContent='লিংক কপি হয়েছে ✓';setTimeout(function(){sh.textContent='শেয়ার ↗'},1800)})}});
  var after=D.querySelector('.rsm')||h;after.parentNode.insertBefore(c,after.nextSibling)}).catch(function(){})}
var qcss=D.createElement('style');qcss.textContent=
'#qotd{margin:14px 0 2px;max-width:520px;border-radius:20px;padding:16px 16px 14px;background:linear-gradient(135deg,#fffaf0,#fff);border:1.5px solid #f6d9a3;box-shadow:0 10px 26px rgba(240,169,58,.14);font-family:"Hind Siliguri",system-ui,sans-serif}'+
'#qotd .qh{display:flex;justify-content:space-between;align-items:center;gap:8px;flex-wrap:wrap}#qotd .qb{font:800 13px "Hind Siliguri",system-ui;color:#8a5a00;background:#fff1c7;border-radius:999px;padding:3px 11px}#qotd .qt{font-size:12.5px;color:#7a6a50;font-weight:600}'+
'#qotd .qq{margin:10px 0 4px;font:700 16px/1.45 Sora,"Hind Siliguri",system-ui;color:#14202b}#qotd .qbq{margin:0;color:#5b6b77;font-size:14px;line-height:1.5}'+
'#qotd .qa{display:flex;gap:8px;flex-wrap:wrap;margin-top:12px}#qotd .qp{background:#0f6b4f;color:#fff;text-decoration:none;font-weight:700;border-radius:999px;padding:9px 16px;font-size:14.5px}#qotd .qs{border:0;background:transparent;color:#8a5a00;font:700 13.5px "Hind Siliguri",system-ui;cursor:pointer;padding:8px 6px}#qotd .qn{border:1.5px solid #f0d49c;background:#fff;color:#8a5a00;border-radius:999px;padding:8px 14px;font:700 14px "Hind Siliguri",system-ui;cursor:pointer}'+
'html[data-theme=dark] #qotd{background:linear-gradient(135deg,#221c10,#13201b);border-color:#4a3a18}html[data-theme=dark] #qotd .qq{color:#e6efec}html[data-theme=dark] #qotd .qbq,html[data-theme=dark] #qotd .qt{color:#b9c6c1}html[data-theme=dark] #qotd .qn{background:transparent;color:#fcd34d;border-color:#4a3a18}';
D.head.appendChild(qcss);



/* ---------- study streak (any public page visit counts) ---------- */
function bn(n){return String(n).replace(/\d/g,function(d){return'০১২৩৪৫৬৭৮৯'[d]})}
function dkey(t){return new Date((t||Date.now())+6*36e5).toISOString().slice(0,10)}
var STREAK=(function(){var d=[];try{d=JSON.parse(localStorage.getItem('agri-days')||'[]');if(!Array.isArray(d))d=[]}catch(e){}var k=dkey();if(d.indexOf(k)<0){d.push(k);d=d.slice(-60);try{localStorage.setItem('agri-days',JSON.stringify(d))}catch(e){}}
 var n=0,t=Date.now();while(d.indexOf(dkey(t))>-1){n++;t-=864e5}return n})();

/* ---------- smart exam plan (home): most-asked questions split over the days left ---------- */
function plan(){if(!isHome||S.plan===false||D.getElementById('xplan'))return;var P=S.plan||{};var ex=new Date(P.date||'2026-11-22T10:00:00+06:00').getTime();if(!ex||isNaN(ex))return;
 var now=Date.now();if(now>ex+3*36e5)return;
 loadIdx().then(function(j){if(D.getElementById('xplan'))return;
  var done=[];try{done=JSON.parse(localStorage.getItem('agn101done')||'[]');if(!Array.isArray(done))done=[]}catch(e){}
  var days=Math.max(1,Math.ceil((ex-now)/864e5));var Q=j.q.slice().sort(function(a,b){return b.c-a.c||(a.id<b.id?-1:1)});
  var left=Q.filter(function(x){return done.indexOf(x.id)<0});var per=Math.ceil(left.length/days);var today=left.slice(0,per);
  var hrs=Math.max(0,Math.floor((ex-now)/36e5));
  var c=D.createElement('div');c.id='xplan';
  function paint(){var dn=[];try{dn=JSON.parse(localStorage.getItem('agn101done')||'[]')}catch(e){}if(!Array.isArray(dn))dn=[];
   var ok=today.filter(function(x){return dn.indexOf(x.id)>-1}).length,tot=Q.filter(function(x){return dn.indexOf(x.id)>-1}).length;
   c.innerHTML='<div class="xp-h"><div><span class="xp-b">📅 স্মার্ট রিভিশন প্ল্যান</span><b>'+esc(P.course||'AGN 101')+' পরীক্ষা: '+(hrs<24?bn(hrs)+' ঘণ্টা বাকি':bn(Math.floor(hrs/24))+' দিন '+(hrs%24?bn(hrs%24)+' ঘণ্টা ':'')+'বাকি')+'</b><small>বেশি আসা প্রশ্ন আগে · মোট '+bn(tot)+'/'+bn(Q.length)+' পড়া শেষ'+(STREAK>1?' · 🔥 '+bn(STREAK)+' দিনের স্ট্রিক':'')+'</small></div><button type="button" class="xp-t" aria-expanded="false">আজকের '+bn(today.length)+'টি ▾</button></div><div class="xp-bar"><i style="width:'+(today.length?Math.round(ok/today.length*100):100)+'%"></i></div>'+
    '<div class="xp-l" hidden>'+(today.length?today.map(function(x){var d1=dn.indexOf(x.id)>-1;return'<div class="xp-i'+(d1?' dn':'')+'"><input type="checkbox" data-xid="'+x.id+'"'+(d1?' checked':'')+' aria-label="পড়া শেষ"><a href="agn101.html#'+x.id+'"><b>'+esc(x.q)+'</b><small>'+esc(j.topics[x.t]||'')+(x.c>=2?' · ★ '+x.c+' বার':'')+'</small></a></div>'}).join(''):'<p class="xp-e">🎉 সব প্রশ্ন পড়া শেষ! এখন <a href="agn101.html#test">Self-test</a> দাও।</p>')+'<p class="xp-n">টিক দিলে AGN 101 নোটেও "পড়া শেষ" হয়ে যায়। প্রতিদিন বাকি প্রশ্নগুলো নিজে থেকে ভাগ হয়ে যায়।</p></div>'}
  paint();var open=false;
  c.addEventListener('click',function(e){if(e.target.closest('.xp-t')){open=!open;c.querySelector('.xp-l').hidden=!open;c.querySelector('.xp-t').setAttribute('aria-expanded',open)}});
  c.addEventListener('change',function(e){var b=e.target.closest('[data-xid]');if(!b)return;var dn=[];try{dn=JSON.parse(localStorage.getItem('agn101done')||'[]')}catch(x){}if(!Array.isArray(dn))dn=[];var id=b.dataset.xid,i=dn.indexOf(id);if(b.checked&&i<0)dn.push(id);if(!b.checked&&i>-1)dn.splice(i,1);try{localStorage.setItem('agn101done',JSON.stringify(dn))}catch(x){}paint();c.querySelector('.xp-l').hidden=!open});
  var a=D.getElementById('qotd')||D.querySelector('.rsm')||D.querySelector('.hcta');var rs=D.querySelector('.rsm');if(a)a.parentNode.insertBefore(c,D.getElementById('qotd')?a:a.nextSibling);if(rs)rs.remove()}).catch(function(){})}
var pcss=D.createElement('style');pcss.textContent=
'#xplan{margin:14px 0 2px;max-width:520px;border-radius:20px;padding:14px 16px;background:linear-gradient(135deg,#eefaf4,#fff);border:1.5px solid #bfe3d1;box-shadow:0 10px 26px rgba(15,107,79,.1);font-family:"Hind Siliguri",system-ui,sans-serif}'+
'#xplan .xp-h{display:flex;justify-content:space-between;align-items:center;gap:10px}#xplan .xp-b{display:inline-block;font:800 12.5px "Hind Siliguri",system-ui;color:#0f6b4f;background:#d9f3e7;border-radius:999px;padding:2px 10px;margin-bottom:4px}#xplan b{display:block;font-size:16px;color:#14202b}#xplan small{display:block;font-size:12.5px;color:#5b6b77}'+
'#xplan .xp-t{flex:none;border:0;background:#0f6b4f;color:#fff;border-radius:999px;padding:8px 13px;font:700 13.5px "Hind Siliguri",system-ui;cursor:pointer}'+
'#xplan .xp-bar{height:6px;border-radius:99px;background:#dcefe5;margin-top:10px;overflow:hidden}#xplan .xp-bar i{display:block;height:100%;background:linear-gradient(90deg,#0f6b4f,#14c58a);transition:width .3s}'+
'#xplan .xp-l{margin-top:10px}#xplan .xp-i{display:flex;gap:10px;align-items:flex-start;padding:8px 4px;border-top:1px dashed #cfe5da}#xplan .xp-i input{width:20px;height:20px;flex:none;margin-top:2px;accent-color:#0f6b4f}#xplan .xp-i a{text-decoration:none;color:inherit;flex:1}#xplan .xp-i b{font-size:14px;font-weight:600;line-height:1.4}#xplan .xp-i.dn b{text-decoration:line-through;opacity:.6}'+
'#xplan .xp-n,#xplan .xp-e{font-size:12.5px;color:#5b6b77;margin:8px 0 0}#xplan .xp-e a{color:#0f6b4f;font-weight:700}'+
'html[data-theme=dark] #xplan{background:linear-gradient(135deg,#10261d,#13201b);border-color:#26372f}html[data-theme=dark] #xplan b{color:#e6efec}html[data-theme=dark] #xplan small,html[data-theme=dark] #xplan .xp-n{color:#93a6a0}html[data-theme=dark] #xplan .xp-bar{background:#26372f}';
D.head.appendChild(pcss);

/* ---------- home: student reviews, community block, AI prompt chips (all from Admin > Home page) ---------- */
function homeExtras(){if(!isHome)return;var main=D.querySelector('main');if(!main)return;
 var anchor=D.getElementById('cta-band')||D.getElementById('feedback');
 var T=(S.testimonials||[]).filter(function(x){return x&&x.t});var ts=D.getElementById('reviews');
 if(T.length){if(!ts){ts=D.createElement('section');ts.id='reviews'}
  ts.innerHTML='<span class="k">Students say</span><h2>শিক্ষার্থীরা <i>যা বলছে</i></h2><p class="sub">ফিডব্যাক ফর্মে পাঠানো আসল মতামত থেকে।</p><div class="rvwg">'+T.map(function(x){return'<figure class="rvw"><div class="rvws" aria-label="'+(+x.r||5)+' stars">'+'★'.repeat(Math.max(1,Math.min(5,+x.r||5)))+'</div><blockquote>'+esc(x.t)+'</blockquote><figcaption>— '+esc(x.n||'শিক্ষার্থী')+'</figcaption></figure>'}).join('')+'</div>';
  if(anchor)anchor.parentNode.insertBefore(ts,anchor);else main.appendChild(ts)}else if(ts)ts.remove();
 var c=S.community||{},cs=D.getElementById('community');
 var L=[['facebook_page','Facebook পেজ','নোটিশ ও আপডেট','#1877f2','<path d="M14 8h3V4h-3a4 4 0 0 0-4 4v2H7v4h3v8h4v-8h3l1-4h-4V8z"/>'],['facebook_group','Facebook গ্রুপ','প্রশ্ন করো, আলোচনা করো','#1877f2','<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20c0-3.6 3-6 6.5-6s6.5 2.4 6.5 6"/><path d="M16 4.5a3.5 3.5 0 0 1 0 7M18 14c2.2.6 3.5 2.6 3.5 5"/>'],['youtube','YouTube','লেকচার ও সাজেশন ভিডিও','#e62117','<rect x="2.5" y="5.5" width="19" height="13" rx="4"/><path d="m10 9.5 5 2.5-5 2.5z"/>'],['telegram','Telegram','দ্রুত নোটিশ','#229ed9','<path d="m21 4-18 7 6 2 2 6 3-4 5 4z"/><path d="m9 13 8-6"/>'],['whatsapp','WhatsApp','সরাসরি যোগাযোগ','#25d366','<path d="M4 20l1.3-4A8 8 0 1 1 8 18.7z"/>'],['email','ইমেইল','যেকোনো প্রশ্ন বা ভুল জানাও','#0f6b4f','<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/>']].filter(function(x){return c[x[0]]});
 if(L.length){if(!cs){cs=D.createElement('section');cs.id='community'}
  cs.innerHTML='<span class="k">Community</span><h2>আমাদের সাথে <i>থাকো</i></h2><p class="sub">নতুন নোট, ভিডিও আর পরীক্ষার আপডেট সবার আগে পেতে যুক্ত হও।'+(c.hours?' <b>সাপোর্ট: '+esc(c.hours)+'</b>':'')+'</p><div class="cmg">'+L.map(function(x){var h=x[0]=='email'?'mailto:'+c.email:c[x[0]];return'<a class="cm" href="'+esc(h)+'"'+(x[0]=='email'?'':' target="_blank" rel="noopener"')+' style="--c:'+x[3]+'"><i><svg viewBox="0 0 24 24" aria-hidden="true">'+x[4]+'</svg></i><span><b>'+x[1]+'</b><small>'+(x[0]=='email'?esc(c.email):x[2])+'</small></span><em>›</em></a>'}).join('')+'</div>';
  if(anchor)anchor.parentNode.insertBefore(cs,anchor);else main.appendChild(cs)}else if(cs)cs.remove();
 hide()}
function aiChips(){if(!isHome||D.getElementById('aichips')||!window.AgriAi)return;var sb=D.querySelector('.hero form, .hero .srch, .hero [role=search]');var h=D.querySelector('.hcta');if(!h)return;
 var Qs=['Tillage কী? সহজ বাংলায় বুঝাও','খরিফ-১ আর খরিফ-২ এর পার্থক্য কী?','Weather আর Climate এর পার্থক্য টেবিলে দেখাও'];
 var d=D.createElement('div');d.id='aichips';d.innerHTML='<span>✨ AI-কে জিজ্ঞেস করো:</span>'+Qs.map(function(q){return'<button type="button">'+esc(q)+'</button>'}).join('');
 d.addEventListener('click',function(e){var b=e.target.closest('button');if(b&&window.AgriAi)window.AgriAi.ask(b.textContent)});
 var q=D.getElementById('qotd');(q||h).parentNode.insertBefore(d,(q||h).nextSibling)}
var hcss=D.createElement('style');hcss.textContent=
'.rvwg{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(260px,100%),1fr));gap:14px;margin-top:18px}.rvw{margin:0;background:#fff;border:1px solid #dbe4e1;border-radius:20px;padding:18px;box-shadow:0 8px 22px rgba(15,107,79,.06);display:flex;flex-direction:column;gap:8px}.rvws{color:#f0a93a;letter-spacing:2px}.rvw blockquote{margin:0;font-size:15px;line-height:1.6;color:#14202b;flex:1}.rvw figcaption{font-weight:700;color:#0f6b4f;font-size:14px}'+
'.cmg{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(240px,100%),1fr));gap:12px;margin-top:18px}.cm{display:flex;align-items:center;gap:12px;padding:14px 16px;border-radius:18px;background:#fff;border:1px solid #dbe4e1;text-decoration:none;color:#14202b;transition:transform .15s,box-shadow .15s}.cm:hover{transform:translateY(-2px);box-shadow:0 10px 24px rgba(0,0,0,.08)}'+
'.cm i{flex:none;width:44px;height:44px;border-radius:14px;display:flex;align-items:center;justify-content:center;background:var(--c);color:#fff}.cm i svg{width:22px;height:22px;fill:none;stroke:currentColor;stroke-width:2;stroke-linecap:round;stroke-linejoin:round}.cm span{flex:1;min-width:0}.cm b{display:block;font-size:15.5px}.cm small{display:block;color:#5b6b77;font-size:13px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.cm em{font-style:normal;font-size:22px;color:#9aa9a3}'+
'#aichips{display:flex;flex-wrap:wrap;gap:8px;align-items:center;margin:14px 0 2px;max-width:640px}#aichips span{font-weight:700;font-size:13.5px;color:#5b3fd1}#aichips button{border:1.5px solid #d9d0ff;background:#f6f3ff;color:#4a32b8;border-radius:999px;padding:7px 13px;font:600 13.5px "Hind Siliguri",system-ui,sans-serif;cursor:pointer;text-align:left}#aichips button:hover{background:#ece6ff}'+
'html[data-theme=dark] .rvw,html[data-theme=dark] .cm{background:#13201b;border-color:#26372f;color:#e6efec}html[data-theme=dark] .rvw blockquote{color:#e6efec}html[data-theme=dark] .rvw figcaption{color:#7ee7c7}html[data-theme=dark] .cm small{color:#93a6a0}html[data-theme=dark] #aichips button{background:#1f1a36;border-color:#3b3166;color:#cbbdff}html[data-theme=dark] #aichips span{color:#b9a8ff}';
D.head.appendChild(hcss);

/* ---------- fresh settings from the server ---------- */
if(C&&C.url){fetch(C.url+'/rest/v1/site_settings?select=value&key=eq.home',{headers:{apikey:C.key,Authorization:'Bearer '+C.key}}).then(function(r){return r.ok?r.json():[]}).then(function(a){var v=(a&&a[0]&&a[0].value)||{};S=v;try{localStorage.setItem(KEY,JSON.stringify(v))}catch(e){}
 if(D.readyState=='loading')D.addEventListener('DOMContentLoaded',apply);else apply()}).catch(function(){})}
})();
