/* Slim "Back / Home" bar for inner pages (needed most in the installed app, which has no browser back button). */
(function(){if(window.__agriBack)return;window.__agriBack=1;
var p=location.pathname.replace(/\/+$/,''),home=/(^|\/)(index\.html)?$/.test(p);if(home)return;
var d=document;function go(){var ref=d.referrer,same=false;try{same=ref&&new URL(ref).origin===location.origin}catch(e){}
 if(same&&history.length>1)history.back();else location.href='index.html'}
function build(){if(d.getElementById('agri-nb'))return;
 var st=d.createElement('style');st.textContent='#agri-nb{display:flex;align-items:center;justify-content:space-between;gap:8px;padding:6px max(12px,env(safe-area-inset-left,0px));padding-top:max(6px,env(safe-area-inset-top,0px));background:#0b1220;color:#fff;font:600 14px system-ui,-apple-system,"Segoe UI",Roboto,sans-serif}#agri-nb a,#agri-nb button{display:inline-flex;align-items:center;gap:6px;color:#fff;background:rgba(255,255,255,.1);border:1px solid rgba(255,255,255,.18);border-radius:999px;padding:5px 13px;font:inherit;text-decoration:none;cursor:pointer;min-height:32px}#agri-nb a:hover,#agri-nb button:hover{background:rgba(255,255,255,.2)}#agri-nb svg{width:16px;height:16px;fill:none;stroke:currentColor;stroke-width:2.2;stroke-linecap:round;stroke-linejoin:round}#agri-nb span.t{opacity:.75;font-weight:600;font-size:13px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}';
 d.head.appendChild(st);
 var b=d.createElement('div');b.id='agri-nb';
 b.innerHTML='<button type="button" aria-label="Go back"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15 5l-7 7 7 7"/></svg>Back</button><span class="t">AGRi Elite Arena</span><a href="index.html" aria-label="Home page"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 11.5 12 4l9 7.5"/><path d="M5 10v10h5v-6h4v6h5V10"/></svg>Home</a>';
 b.querySelector('button').onclick=go;d.body.insertBefore(b,d.body.firstChild)}
if(d.body)build();else d.addEventListener('DOMContentLoaded',build)})();
