/* PDF reader: read any PDF inside the site (pdf.js, self-hosted) and still offer Download.
   Use: <a data-read href="file.pdf" data-title="Name" data-dl="https://...download link">  or  PDFReader.open(url, title, downloadUrl)
   On pages with ".file .acts a[download]" buttons a "Read" button is added automatically. */
(function(){
var ov=null,doc=null,io=null,zoom=1,cur=null;
function el(t,c,h){var e=document.createElement(t);if(c)e.className=c;if(h!=null)e.innerHTML=h;return e}
function css(){if(document.getElementById('pdfr-css'))return;var s=el('style');s.id='pdfr-css';s.textContent='#pdfr{position:fixed;inset:0;z-index:2000;background:#1c2420;display:flex;flex-direction:column;font-family:system-ui,sans-serif}#pdfr .bar{display:flex;align-items:center;gap:8px;padding:8px 10px;background:#0f6b4f;color:#fff;flex-wrap:wrap}#pdfr .bar b{flex:1;min-width:120px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-size:15px}#pdfr .bar button,#pdfr .bar a{font:600 14px system-ui,sans-serif;border:0;border-radius:999px;padding:7px 14px;cursor:pointer;background:rgba(255,255,255,.18);color:#fff;text-decoration:none}#pdfr .bar a.dl{background:#f0a93a;color:#3a2a05}#pdfr .pg{font-size:13px;opacity:.9;white-space:nowrap}#pdfr .body{flex:1;overflow:auto;padding:12px 0;-webkit-overflow-scrolling:touch}#pdfr .pgbox{margin:0 auto 12px;background:#fff;box-shadow:0 2px 12px rgba(0,0,0,.4);position:relative}#pdfr canvas{display:block;width:100%;height:100%}#pdfr .msg{color:#fff;text-align:center;padding:40px 16px}';document.head.appendChild(s)}
function close(){if(!ov)return;if(io)io.disconnect();io=null;try{doc&&doc.destroy()}catch(e){}doc=null;ov.remove();ov=null;document.body.style.overflow=window.__pdfrOv||'';document.removeEventListener('keydown',key)}
function key(e){if(e.key=='Escape')close()}
async function open(url,title,dl,start){
 css();close();cur={url:url,title:title,dl:dl};zoom=1;window.__pdfrOv=document.body.style.overflow;document.body.style.overflow='hidden';
 ov=el('div');ov.id='pdfr';ov.setAttribute('role','dialog');ov.setAttribute('aria-label','PDF reader');
 var bar=el('div','bar');var t=el('b');t.textContent=title||'PDF';var pg=el('span','pg','');var zo=el('button',null,'−'),zi=el('button',null,'+'),dd=el('a','dl','⬇ Download'),cl=el('button',null,'✕ Close');zo.setAttribute('aria-label','Zoom out');zi.setAttribute('aria-label','Zoom in');
 dd.href=dl||url;dd.setAttribute('download',(title||'document')+'.pdf');dd.rel='noopener';
 bar.appendChild(t);bar.appendChild(pg);bar.appendChild(zo);bar.appendChild(zi);bar.appendChild(dd);bar.appendChild(cl);
 var body=el('div','body');body.appendChild(el('div','msg','Loading PDF…'));ov.appendChild(bar);ov.appendChild(body);document.body.appendChild(ov);document.addEventListener('keydown',key);
 cl.onclick=close;
 try{
  var base=(document.currentScript&&document.currentScript.src)||'';var root=new URL('vendor/pdfjs/',new URL(window.__pdfrBase||'./',location.href)).href;
  var lib=await import(root+'pdf.min.mjs');lib.GlobalWorkerOptions.workerSrc=root+'pdf.worker.min.mjs';
  if(!ov)return;var d=await lib.getDocument({url:url,withCredentials:false}).promise;if(!ov){d.destroy();return}doc=d;
  body.innerHTML='';var n=d.numPages,boxes=[],sizes=[];
  var first=await d.getPage(1),vp1=first.getViewport({scale:1});
  function width(){return Math.min(body.clientWidth-16,1100)*zoom}
  function layout(){var w=width();boxes.forEach(function(b,i){var vp=sizes[i];b.style.width=w+'px';b.style.height=Math.round(w*vp.h/vp.w)+'px';if(b.dataset.done){b.dataset.done='';var c=b.firstChild;if(c)b.removeChild(c)}});observe()}
  for(var i=1;i<=n;i++){var b=el('div','pgbox');b.dataset.p=i;sizes.push({w:vp1.width,h:vp1.height});boxes.push(b);body.appendChild(b)}
  async function render(b){var num=+b.dataset.p;if(b.dataset.done)return;b.dataset.done='1';var page=await d.getPage(num),vp0=page.getViewport({scale:1}),w=width(),sc=w/vp0.width,dpr=Math.min(window.devicePixelRatio||1,2),vp=page.getViewport({scale:sc*dpr});
   sizes[num-1]={w:vp0.width,h:vp0.height};b.style.height=Math.round(w*vp0.height/vp0.width)+'px';b.style.width=w+'px';
   var c=document.createElement('canvas');c.width=Math.floor(vp.width);c.height=Math.floor(vp.height);if(!ov||!b.isConnected)return;b.appendChild(c);await page.render({canvasContext:c.getContext('2d'),viewport:vp}).promise}
  function observe(){if(io)io.disconnect();io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){render(e.target).catch(function(){})}else if(e.target.dataset.done&&Math.abs(e.boundingClientRect.top)>body.clientHeight*4){e.target.dataset.done='';while(e.target.firstChild)e.target.removeChild(e.target.firstChild)}})},{root:body,rootMargin:'600px 0px'});boxes.forEach(function(b){io.observe(b)})}
  layout();pg.textContent='1 / '+n;
  function cp(){var st=body.scrollTop,k=1;for(var i=0;i<boxes.length;i++){if(boxes[i].offsetTop-body.offsetTop<=st+body.clientHeight/3)k=i+1;else break}return k}
  var raf=0;body.addEventListener('scroll',function(){if(raf)return;raf=requestAnimationFrame(function(){raf=0;var k=cp();pg.textContent=k+' / '+n;try{localStorage.setItem('agri-lastpdf',JSON.stringify({url:url,title:title||'PDF',dl:dl||'',page:k,ts:Date.now()}))}catch(e){}})},{passive:true});
  if(start>1&&start<=n)setTimeout(function(){body.scrollTop=boxes[start-1].offsetTop-body.offsetTop-8;body.dispatchEvent(new Event('scroll'))},150);
  zo.onclick=function(){zoom=Math.max(.5,+(zoom-.25).toFixed(2));layout()};zi.onclick=function(){zoom=Math.min(3,+(zoom+.25).toFixed(2));layout()};
  var rt;window.addEventListener('resize',function(){clearTimeout(rt);rt=setTimeout(function(){if(ov)layout()},200)});
 }catch(err){
  if(!ov)return;var b2=ov.querySelector('.body');b2.innerHTML='';var m=el('div','msg');m.textContent='Could not show this PDF here. ';var a=el('a',null,'Open it in a new tab');a.href=url;a.target='_blank';a.rel='noopener';a.style.color='#f0a93a';m.appendChild(a);b2.appendChild(m)}
}
window.PDFReader={open:open,close:close};
document.addEventListener('click',function(e){var a=e.target.closest('[data-read]');if(!a)return;e.preventDefault();open(a.getAttribute('data-read')||a.getAttribute('href'),a.getAttribute('data-title')||a.textContent.trim(),a.getAttribute('data-dl')||undefined)});
/* auto "Read" buttons for the static download cards */
function auto(){document.querySelectorAll('.file .acts').forEach(function(box){var d=box.querySelector('a[download][href$=".pdf"]');if(!d||box.querySelector('[data-read]'))return;var t=box.parentNode.querySelector('.t b'),b=el('a','pill p','Read online');b.href=d.getAttribute('href');b.setAttribute('data-read',d.getAttribute('href'));b.setAttribute('data-title',t?t.textContent:'PDF');box.insertBefore(b,d)})}
/* every other local PDF download link gets a "Read" button beside it (also links added later by scripts) */
function auto2(){document.querySelectorAll('a[download][href$=".pdf"]').forEach(function(d){if(d.closest('.file .acts')||d.closest('#pdfr')||d.dataset.rd||d.nextElementSibling&&d.nextElementSibling.hasAttribute('data-read'))return;d.dataset.rd=1;var h=d.getAttribute('href'),b=el('a',(d.className||'')+' rdb','');var lb=(d.textContent.split('\u00B7').pop()||'').replace(/\(.*?\)/g,'').replace(/^\s*[^A-Za-z]*/,'').trim();b.textContent='\uD83D\uDC41 Read'+(lb&&lb.length<30?' \u00B7 '+lb:' online');b.href=h;b.setAttribute('data-read',h);b.setAttribute('data-title',(d.getAttribute('download')||h).replace(/\.pdf$/i,'').replace(/_/g,' '));b.setAttribute('data-dl',h);d.parentNode.insertBefore(b,d)})}
function all(){auto();auto2()}var tm;
if(document.readyState!='loading')all();else document.addEventListener('DOMContentLoaded',all);
if(window.MutationObserver)new MutationObserver(function(){clearTimeout(tm);tm=setTimeout(auto2,120)}).observe(document.documentElement,{childList:true,subtree:true});
})();
