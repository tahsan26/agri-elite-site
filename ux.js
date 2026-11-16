/* AGRi ELITE NOTES - small reading helpers: progress bar, back-to-top, "continue where you left off". No server, no tracking. */
(function(){if(window.__agriUx)return;window.__agriUx=1;
var d=document,H=d.documentElement,path=location.pathname.replace(/^\//,'')||'index.html',home=/(^|\/)(index\.html)?$/.test(location.pathname);
var css=d.createElement('style');css.textContent='#ux-pg{position:fixed;left:0;top:0;height:3px;width:0;background:linear-gradient(90deg,#10b981,#f0a93a);z-index:2147482000;pointer-events:none;transition:width .1s}#ux-up{position:fixed;right:14px;bottom:78px;width:40px;height:40px;border-radius:50%;border:1px solid rgba(0,0,0,.12);background:#fff;color:#0f6b4f;font:800 18px/1 system-ui;cursor:pointer;box-shadow:0 6px 16px rgba(0,0,0,.18);z-index:79;opacity:0;pointer-events:none;transition:opacity .2s}#ux-up.on{opacity:.92;pointer-events:auto}html[data-theme=dark] #ux-up{background:#14231d;color:#6ee7b7;border-color:#27403a}.ux-c{display:flex;align-items:center;gap:10px;max-width:640px;margin:10px auto 0;padding:9px 14px;border-radius:14px;background:#fff;border:1px solid rgba(15,107,79,.25);box-shadow:0 4px 14px rgba(0,0,0,.08);text-decoration:none;color:#0f6b4f;font:700 13.5px system-ui,sans-serif;position:relative;z-index:2}.ux-c small{display:block;font-weight:500;color:#5b6b66;font-size:12px}.ux-c b{margin-left:auto}html[data-theme=dark] .ux-c{background:#14231d;color:#6ee7b7;border-color:#27403a}html[data-theme=dark] .ux-c small{color:#9db3ab}';
d.head.appendChild(css);
var bar=d.createElement('div');bar.id='ux-pg';var up=d.createElement('button');up.id='ux-up';up.type='button';up.setAttribute('aria-label','Back to top');up.textContent='↑';
function add(){d.body.appendChild(bar);d.body.appendChild(up)}
function upd(){var h=H.scrollHeight-H.clientHeight,y=window.scrollY||H.scrollTop;bar.style.width=(h>0?Math.min(100,y*100/h):0)+'%';up.classList.toggle('on',y>700)}
up.onclick=function(){window.scrollTo({top:0,behavior:'smooth'})};
function save(){try{if(!home&&/^(agf101|ssc101|soc101|course|library)\.html$/.test(path))localStorage.setItem('agri-lastpage',JSON.stringify({u:path,t:(d.title||path).replace(/\s*[·|\-–].*$/,'').slice(0,50),ts:Date.now()}))}catch(e){}}
function chip(){if(!home)return;try{var l=JSON.parse(localStorage.getItem('agri-lastpage')||'null');if(!l||!l.u||Date.now()-l.ts>30*864e5||d.getElementById('ux-c'))return;
 var a=d.createElement('a');a.id='ux-c';a.className='ux-c';a.href=l.u;a.innerHTML='<span>▶</span><span>Continue where you left off<small></small></span><b>Open →</b>';a.querySelector('small').textContent=l.t;
 var cd=d.getElementById('agri-cd'),hero=d.querySelector('.hero .wrap');if(hero)hero.insertBefore(a,hero.firstChild);else if(cd)cd.parentNode.insertBefore(a,cd.nextSibling)}catch(e){}}
function init(){add();upd();save();chip();window.addEventListener('scroll',upd,{passive:true});window.addEventListener('resize',upd)}
if(d.body)init();else d.addEventListener('DOMContentLoaded',init)})();
