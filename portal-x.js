/* AGRi Elite Arena - student portal add-ons: AI mock exam, study groups + challenges, badges + certificates.
   Loaded BEFORE the main portal script; the portal calls window.AgriPortalExt(ctx) once its helpers exist. Plain JS, no build step. */
(function(){
window.AgriPortalExt=function(X){
var sb=X.sb,V=X.V,$=X.$,esc=X.esc,msg=X.msg,C=X.C;
var css=document.createElement('style');css.textContent=
'.x-row{display:flex;gap:10px;flex-wrap:wrap;align-items:center}.x-row>*{min-width:0}.x-grow{flex:1 1 180px}'+
'.x-bar{position:sticky;top:96px;z-index:5;background:var(--card);border:1px solid var(--line);border-radius:14px;padding:10px 14px;margin:10px 0;display:flex;gap:12px;align-items:center;justify-content:space-between;flex-wrap:wrap;box-shadow:0 6px 18px rgba(0,0,0,.08)}'+
'.x-time{font:800 22px/1 system-ui,sans-serif;font-variant-numeric:tabular-nums;color:var(--g)}.x-time.low{color:var(--red);animation:xp 1s infinite}@keyframes xp{50%{opacity:.45}}'+
'.x-q{margin:14px 0;padding:14px;border:1px solid var(--line);border-radius:14px;background:var(--card)}.x-q h4{margin:0 0 8px;font-size:16px;line-height:1.5}'+
'.x-ex{margin-top:8px;padding:9px 12px;border-radius:10px;background:var(--mint);font-size:14px}'+
'.x-score{font:800 44px/1 system-ui,sans-serif;color:var(--g)}.x-pill{display:inline-block;padding:2px 10px;border-radius:999px;font-size:12.5px;font-weight:700;background:var(--mint);color:var(--g)}'+
'.x-bg{display:grid;grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:10px}'+
'.x-b{border:1.5px solid var(--line);border-radius:16px;padding:12px;text-align:center;background:var(--card);cursor:default}.x-b.on{border-color:var(--gold);background:linear-gradient(180deg,rgba(240,169,58,.16),transparent);cursor:pointer}.x-b.on:hover{box-shadow:0 8px 22px rgba(240,169,58,.3)}'+
'.x-b .ic{font-size:34px;line-height:1.2}.x-b.off .ic{filter:grayscale(1);opacity:.45}.x-b b{display:block;font-size:14.5px;margin-top:4px}.x-b small{display:block;color:var(--mute);font-size:12.5px;margin-top:2px}'+
'.x-pg{height:6px;border-radius:99px;background:var(--line);margin-top:8px;overflow:hidden}.x-pg i{display:block;height:100%;background:var(--g)}'+
'.x-t-gold{border-color:#d9a21e}.x-code{font:800 22px/1 ui-monospace,Menlo,monospace;letter-spacing:3px;background:var(--mint);padding:6px 12px;border-radius:10px;color:var(--g)}'+
'#x-cv{max-width:100%;height:auto;border:1px solid var(--line);border-radius:10px;background:#fff}'+
'.x-tbl{width:100%;border-collapse:collapse}.x-tbl td,.x-tbl th{padding:7px 6px;border-bottom:1px solid var(--line)}';
document.head.appendChild(css);

function need(r){return r&&r.error&&/function|does not exist|schema cache|relation/i.test(r.error.message||'')?msg('This feature needs the latest database update (SQL stage 18). Ask the site owner to run it.'):null}
function fmt(s){s=Math.max(0,s|0);return String(Math.floor(s/60)).padStart(2,'0')+':'+String(s%60).padStart(2,'0')}
function shuffle(a){a=a.slice();for(var i=a.length-1;i>0;i--){var j=Math.floor(Math.random()*(i+1)),t=a[i];a[i]=a[j];a[j]=t}return a}
function plain(h){try{return new DOMParser().parseFromString(String(h||''),'text/html').body.textContent.replace(/\s+/g,' ').trim()}catch(e){return''}}

/* ───────────────────────── AI MOCK EXAM ───────────────────────── */
async function aiBig(prompt,course,max){
 try{var ss=await sb.auth.getSession(),tok=ss.data.session&&ss.data.session.access_token;
  var r=await fetch(C.url+'/functions/v1/ask-ai',{method:'POST',headers:{'Content-Type':'application/json',apikey:C.key,Authorization:'Bearer '+(tok||C.key)},body:JSON.stringify({messages:[{role:'user',text:prompt}],course:course||'',device:'portal',long:true,max:max})});
  var d=await r.json().catch(function(){return{}});return r.ok&&d.answer?{ok:1,answer:d.answer,left:d.left}:{ok:0,error:d.error||('Error '+r.status)}}
 catch(e){return{ok:0,error:'Could not reach the AI service. Check your internet.'}}}
function parseQs(s){
 var i=s.indexOf('[');if(i<0)return null;var t=s.slice(i),j=t.lastIndexOf(']'),arr=null;
 if(j>0){try{arr=JSON.parse(t.slice(0,j+1))}catch(e){arr=null}}
 if(!arr){var k=t.lastIndexOf('}');while(k>0&&!arr){try{arr=JSON.parse(t.slice(0,k+1)+']')}catch(e){arr=null}if(!arr)k=t.lastIndexOf('}',k-1)}}
 if(!Array.isArray(arr))return null;
 arr=arr.filter(function(x){return x&&typeof x.q=='string'&&x.q.length>3&&Array.isArray(x.o)&&x.o.length>=2&&x.o.length<=6&&x.o.every(function(o){return typeof o=='string'&&o.length})&&Number.isInteger(x.a)&&x.a>=0&&x.a<x.o.length});
 var seen={};arr=arr.filter(function(x){var k=x.q.trim().toLowerCase();if(seen[k])return false;seen[k]=1;return true});
 return arr.length?arr:null}
function grade(p){return p>=80?['A+','Excellent! You are exam ready.']:p>=70?['A','Very good. A little more revision and you are there.']:p>=60?['B','Good. Revise the questions you missed.']:p>=50?['C','Passed, but revise the weak topics again.']:['Needs work','Do not worry. Read the notes again and retry a new mock.']}

V.mock=async function(){
 var st=X.st(),cs=st.courses||[];
 if(!cs.length){$('main').innerHTML='<h2>AI Mock Exam</h2><div class="card"><p class="m">No courses are published yet.</p></div>';return}
 $('main').innerHTML='<h2>AI Mock Exam</h2><div class="card"><p class="m">A timed exam made by AI from the published notes of your course: 1 minute per question, instant marking with explanations, saved to your progress and badges. Uses 1 of your 20 daily AI questions. AI can make mistakes, so check doubtful answers in the notes.</p><form id="mkf" class="x-row" style="margin-top:8px"><label class="x-grow">Course<select id="mkc">'+cs.map(function(c){return'<option value="'+esc(c.id)+'">'+esc(c.code)+' · '+esc(c.title)+'</option>'}).join('')+'</select></label><label>Questions<select id="mkn"><option value="5">5 (5 min)</option><option value="10" selected>10 (10 min)</option><option value="15">15 (15 min)</option></select></label><button class="btn" id="mkb" style="align-self:end">Start mock exam</button></form></div><div id="mkx"></div>';
 $('mkf').onsubmit=async function(e){e.preventDefault();var cid=$('mkc').value,n=+$('mkn').value,course=cs.filter(function(c){return c.id===cid})[0];$('mkb').disabled=true;
  var box=$('mkx');box.innerHTML='<div class="card"><p class="m">Collecting notes and asking AI to set your exam… this takes 10 to 25 seconds.</p></div>';
  try{
   var nr=await sb.from('notes').select('title,question_bn,answer_html').eq('course_id',cid).eq('status','published').limit(80);
   var notes=shuffle(nr.data||[]).slice(0,Math.max(4,Math.ceil(n*.7))),mat='',per=Math.floor(4200/Math.max(notes.length,1));
   notes.forEach(function(x,i){var t=plain(x.answer_html).slice(0,per-60);mat+=(i+1)+') '+String(x.title||'').slice(0,100)+(x.question_bn?' ['+String(x.question_bn).slice(0,100)+']':'')+': '+t+'\n'});
   var prompt='You are an exam setter for HSTU Agriculture students. Make exactly '+n+' multiple-choice questions for a timed mock exam on the course "'+course.code+' · '+course.title+'", using the study material below'+(mat?' (stay inside it)':'')+'. Mix easy, medium and hard (about 40/40/20) and spread them over different topics. Each question has 4 options, exactly one correct, plausible wrong options, and a one-line explanation. Write in the same language as the material (if Bangla, write Bangla and keep key English terms). Reply with ONLY a JSON array, no other words, like [{"q":"question","o":["A","B","C","D"],"a":0,"e":"one short reason"}] where "a" is the index 0-3 of the correct option.\n'+(mat?'Material:\n'+mat:'');
   var r=await aiBig(prompt,course.code+' '+course.title,Math.min(3500,300*n+600));
   if(!r.ok){box.innerHTML='<div class="msg e">'+esc(r.error)+'</div>';return}
   var qs=parseQs(r.answer);
   if(!qs||qs.length<Math.min(3,n)){box.innerHTML='<div class="msg e">The AI did not return a usable exam this time. Please try again.</div>';return}
   qs=qs.slice(0,n);qs.forEach(function(q){var c=q.o[q.a],sh=shuffle(q.o);q.o=sh;q.a=sh.indexOf(c)});
   runMock(box,qs,course,n,r.left)
  }catch(err){box.innerHTML='<div class="msg e">'+esc(err.message||err)+'</div>'}finally{var b=$('mkb');if(b)b.disabled=false}}};

function runMock(box,qs,course,asked,left){
 var total=Math.max(5,qs.length)*60,end=Date.now()+total*1000,ans=new Array(qs.length).fill(-1),done=false,iv=null,uid=X.st().U.id;
 box.innerHTML='<div class="x-bar"><b>'+esc(course.code)+' mock exam</b><span class="m" id="mkp">0 / '+qs.length+' answered</span><span class="x-time" id="mkt">'+fmt(total)+'</span></div><div id="mkq"></div><div class="x-row" style="margin:10px 0"><button class="btn" id="mks">Submit exam</button><span class="m">'+(qs.length<asked?('AI made '+qs.length+' of '+asked+' questions this time. '):'')+(left!=null?('AI questions left today: '+left):'')+'</span></div>';
 var q=$('mkq');
 qs.forEach(function(it,qi){var d=document.createElement('div');d.className='x-q';var h=document.createElement('h4');h.textContent=(qi+1)+'. '+it.q;d.appendChild(h);
  it.o.forEach(function(o,oi){var b=document.createElement('button');b.type='button';b.className='opt';b.textContent=String.fromCharCode(65+oi)+'. '+o;b.onclick=function(){if(done)return;ans[qi]=oi;d.querySelectorAll('.opt').forEach(function(x,k){x.classList.toggle('sel',k===oi)});$('mkp').textContent=ans.filter(function(a){return a>=0}).length+' / '+qs.length+' answered'};d.appendChild(b)});q.appendChild(d)});
 function beforeUnload(e){if(!done){e.preventDefault();e.returnValue=''}}
 window.addEventListener('beforeunload',beforeUnload);
 function tick(){var t=document.getElementById('mkt');if(!t){clearInterval(iv);window.removeEventListener('beforeunload',beforeUnload);return}var s=Math.round((end-Date.now())/1000);t.textContent=fmt(s);t.classList.toggle('low',s<=60);if(s<=0)finish(true)}
 iv=setInterval(tick,500);
 $('mks').onclick=function(){var un=ans.filter(function(a){return a<0}).length;if(un&&!confirm(un+' question'+(un>1?'s are':' is')+' unanswered. Submit anyway?'))return;finish(false)};
 async function finish(auto){
  if(done)return;done=true;clearInterval(iv);window.removeEventListener('beforeunload',beforeUnload);
  var ok=0,det=[];qs.forEach(function(it,i){var g=ans[i]===it.a;if(g)ok++;det.push({t:'mock',ok:g,qid:null,w:!g})});
  var used=Math.round((total*1000-(end-Date.now()))/1000),pct=Math.round(ok*100/qs.length),gr=grade(pct);
  var h='<div class="card"><div class="x-row"><div><div class="x-score">'+ok+' / '+qs.length+'</div><span class="x-pill">'+pct+'% · Grade '+esc(gr[0])+'</span></div><p class="x-grow" style="margin:0">'+esc(gr[1])+(auto?' (Time was up, your answers were submitted automatically.)':'')+'<br><span class="m">Time used: '+fmt(used)+'</span></p></div><p class="m" id="mks2">Saving to your progress…</p><div class="x-row"><button class="btn" id="mkn2">New mock exam</button><button class="btn s" id="mkw">Show only wrong answers</button></div></div><div id="mkr"></div>';
  box.innerHTML=h;
  function review(onlyWrong){var r=$('mkr');r.innerHTML='';qs.forEach(function(it,i){var good=ans[i]===it.a;if(onlyWrong&&good)return;var d=document.createElement('div');d.className='x-q';var t=document.createElement('h4');t.textContent=(i+1)+'. '+it.q;d.appendChild(t);
   it.o.forEach(function(o,oi){var b=document.createElement('div');b.className='opt '+(oi===it.a?'ok':(oi===ans[i]?'bad':''));b.style.cursor='default';b.textContent=String.fromCharCode(65+oi)+'. '+o+(oi===it.a?'  ✓':(oi===ans[i]?'  ✗ (your answer)':''));d.appendChild(b)});
   if(ans[i]<0){var n=document.createElement('p');n.className='m';n.textContent='Not answered';d.appendChild(n)}
   if(typeof it.e=='string'&&it.e){var e=document.createElement('div');e.className='x-ex';e.textContent='Why: '+it.e;d.appendChild(e)}r.appendChild(d)});
   if(!r.firstChild)r.innerHTML='<div class="card"><b>🎉 No wrong answers. Perfect!</b></div>'}
  review(false);$('mkw').onclick=function(){review(true)};$('mkn2').onclick=function(){V.mock()};
  var ins=await sb.from('quiz_attempts').insert({user_id:uid,course_id:course.id,score:ok,total:qs.length,detail:det});
  var m=$('mks2');if(m)m.textContent=ins.error?'Could not save this result: '+ins.error.message:'Saved to your progress. Check your Badges!'}
}

/* ───────────────────────── STUDY GROUPS + CHALLENGES ───────────────────────── */
function left(ts){var s=(new Date(ts)-Date.now())/1000;if(s<=0)return'ended';var d=Math.floor(s/86400),h=Math.floor(s%86400/3600);return d>0?d+'d '+h+'h left':h+'h '+Math.floor(s%3600/60)+'m left'}
function copy(t,done){try{navigator.clipboard.writeText(t).then(function(){done&&done(true)},function(){done&&done(false)})}catch(e){done&&done(false)}}
V.groups=async function(){
 $('main').innerHTML='<h2>Study groups</h2><div class="card"><p class="m">Make a group with your friends, share the code, and compete in quiz challenges. Only members can see the group board. Points come from the quizzes and mock exams you take.</p><div class="x-row"><form id="gcf" class="x-row x-grow"><input id="gcn" class="x-grow" placeholder="New group name" maxlength="40" required minlength="3"><button class="btn">Create group</button></form><form id="gjf" class="x-row x-grow"><input id="gjc" class="x-grow" placeholder="Have a code? e.g. 3F9A1C" maxlength="12" required style="text-transform:uppercase"><button class="btn s">Join</button></form></div><div id="gmsg"></div></div><div id="gl"><p class="m">Loading…</p></div><div id="gb"></div>';
 async function load(){
  var r=await sb.rpc('group_my');var nd=need(r);if(nd){$('gl').innerHTML=nd;return}
  if(r.error){$('gl').innerHTML=msg(r.error.message);return}
  var d=r.data||[];
  if(!d.length){$('gl').innerHTML='<div class="card"><p class="m">You are not in any group yet. Create one above or join with a friend\'s code.</p></div>';return}
  $('gl').innerHTML=d.map(function(g){return'<div class="card" data-g="'+esc(g.id)+'"><div class="x-row"><b class="x-grow" style="font-size:17px">'+esc(g.name)+(g.is_owner?' <span class="x-pill">owner</span>':'')+'</b><span class="m">'+g.members+' member'+(g.members>1?'s':'')+'</span></div><div class="x-row" style="margin:8px 0"><span class="m">Code</span><span class="x-code">'+esc(g.code)+'</span><button class="btn s" data-a="copy" data-c="'+esc(g.code)+'">Copy</button><button class="btn s" data-a="share" data-c="'+esc(g.code)+'" data-n="'+esc(g.name)+'">Share</button></div>'+(g.ch_id?'<p style="margin:6px 0">🏁 <b>'+esc(g.ch_title)+'</b> <span class="x-pill">'+esc(left(g.ch_ends))+'</span></p>':'<p class="m" style="margin:6px 0">No challenge running. Showing the last 7 days.</p>')+'<div class="x-row"><button class="btn" data-a="board">Leaderboard</button>'+(g.is_owner&&!g.ch_id?'<button class="btn g" data-a="chal">Start a challenge</button>':'')+'<button class="btn s" data-a="leave">Leave</button></div><div class="x-cf"></div></div>'}).join('')}
 $('gl').onclick=async function(e){var b=e.target.closest('button[data-a]');if(!b)return;var card=b.closest('[data-g]'),gid=card.dataset.g,a=b.dataset.a;
  if(a==='copy'){copy(b.dataset.c,function(ok){b.textContent=ok?'Copied ✓':b.dataset.c})}
  else if(a==='share'){var txt='Join my study group "'+b.dataset.n+'" on AGRi Elite Arena. Open the Student Portal → Groups → Join, and enter this code: '+b.dataset.c;if(navigator.share){navigator.share({title:'AGRi Elite Arena study group',text:txt,url:location.origin+'/portal.html'}).catch(function(){})}else copy(txt+' '+location.origin+'/portal.html',function(ok){b.textContent=ok?'Copied ✓':'Share'})}
  else if(a==='board')board(gid)
  else if(a==='leave'){if(!confirm('Leave this group?'))return;var r=await sb.rpc('group_leave',{p_group:gid});if(r.error)$('gmsg').innerHTML=msg(r.error.message);$('gb').innerHTML='';load()}
  else if(a==='chal'){var cf=card.querySelector('.x-cf');cf.innerHTML='<form class="x-row" style="margin-top:10px"><input class="x-grow" name="t" placeholder="Challenge title, e.g. Ozone week" maxlength="60" minlength="3" required><select name="d"><option value="3">3 days</option><option value="7" selected>7 days</option><option value="14">14 days</option></select><select name="c"><option value="">All courses</option>'+(X.st().courses||[]).map(function(c){return'<option value="'+esc(c.id)+'">'+esc(c.code)+'</option>'}).join('')+'</select><button class="btn g">Start</button></form>';
   cf.firstChild.onsubmit=async function(ev){ev.preventDefault();var f=ev.target,r=await sb.rpc('challenge_create',{p_group:gid,p_title:f.t.value,p_days:+f.d.value,p_course:f.c.value||null});if(r.error){$('gmsg').innerHTML=msg(r.error.message);return}$('gmsg').innerHTML=msg('Challenge started. Members were notified.',true);await load();board(gid)}}};
 async function board(gid){var r=await sb.rpc('group_board',{p_group:gid});if(r.error){$('gb').innerHTML=msg(r.error.message);return}var d=r.data||[],t=d[0]&&d[0].ch_title;
  $('gb').innerHTML='<div class="card"><b>'+(t?'🏁 '+esc(t)+' · '+esc(left(d[0].ch_ends)):'Group leaderboard · last 7 days')+'</b>'+(d.length?'<table class="x-tbl" style="margin-top:8px"><tr><th align="left">#</th><th align="left">Name</th><th align="right">Points</th><th align="right">Quizzes</th><th align="right">Avg</th></tr>'+d.map(function(x){return'<tr'+(x.is_me?' style="font-weight:800;background:rgba(15,107,79,.12)"':'')+'><td>'+(x.pos==1&&x.points>0?'🥇':x.pos==2&&x.points>0?'🥈':x.pos==3&&x.points>0?'🥉':x.pos)+'</td><td>'+esc(x.name)+(x.is_me?' (you)':'')+'</td><td align="right">'+x.points+'</td><td align="right">'+x.quizzes+'</td><td align="right">'+x.pct+'%</td></tr>'}).join('')+'</table>':'<p class="m">No members yet.</p>')+'</div>';
  $('gb').scrollIntoView({behavior:'smooth',block:'nearest'})}
 $('gcf').onsubmit=async function(e){e.preventDefault();var r=await sb.rpc('group_create',{p_name:$('gcn').value});if(r.error){$('gmsg').innerHTML=need(r)||msg(r.error.message);return}$('gcn').value='';$('gmsg').innerHTML=msg('Group created. Share the code with your friends.',true);load()};
 $('gjf').onsubmit=async function(e){e.preventDefault();var r=await sb.rpc('group_join',{p_code:$('gjc').value});if(r.error){$('gmsg').innerHTML=need(r)||msg(r.error.message);return}$('gjc').value='';$('gmsg').innerHTML=msg('You joined the group.',true);load()};
 await load()};

/* ───────────────────────── BADGES + CERTIFICATES ───────────────────────── */
function drawCert(cv,name,b,dt,serial){
 var W=1600,H=1130,c=cv.getContext('2d');cv.width=W;cv.height=H;
 c.fillStyle='#fffdf6';c.fillRect(0,0,W,H);
 var g=c.createLinearGradient(0,0,W,H);g.addColorStop(0,'#0a4a37');g.addColorStop(1,'#14c58a');
 c.lineWidth=26;c.strokeStyle=g;c.strokeRect(30,30,W-60,H-60);c.lineWidth=4;c.strokeStyle='#d9a21e';c.strokeRect(66,66,W-132,H-132);
 c.textAlign='center';c.fillStyle='#0a4a37';
 var F='"Hind Siliguri","Noto Sans Bengali","Segoe UI",system-ui,sans-serif',S='Georgia,"Times New Roman",serif';
 c.font='700 30px '+F;c.fillStyle='#0f6b4f';c.fillText('AGRi Elite Arena',W/2,150);
 c.font='500 24px '+F;c.fillStyle='#5a6e65';c.fillText('HSTU · Faculty of Agriculture study platform',W/2,190);
 c.font='700 78px '+S;c.fillStyle='#0a4a37';c.fillText('Certificate of Achievement',W/2,330);
 c.fillStyle='#d9a21e';c.fillRect(W/2-150,360,300,5);
 c.font='italic 34px '+S;c.fillStyle='#4b5b53';c.fillText('This certificate is proudly presented to',W/2,440);
 var nm=String(name||'Student').slice(0,60),fs=96;c.fillStyle='#0f6b4f';do{c.font='700 '+fs+'px '+F;fs-=4}while(c.measureText(nm).width>W-300&&fs>40);
 c.fillText(nm,W/2,560);c.fillStyle='#d9a21e';c.fillRect(W/2-420,590,840,3);
 c.font='140px "Segoe UI Emoji","Apple Color Emoji","Noto Color Emoji",sans-serif';c.fillStyle='#000';c.fillText(b.icon,W/2,770);
 c.font='700 58px '+F;c.fillStyle='#0a4a37';c.fillText(b.title,W/2,850);
 c.font='500 32px '+F;c.fillStyle='#4b5b53';c.fillText(b.descr,W/2,905);
 c.font='500 26px '+F;c.fillStyle='#5a6e65';c.textAlign='left';c.fillText('Date: '+dt,140,985);c.textAlign='right';c.fillText('Certificate ID: '+serial,W-140,985);
 c.textAlign='center';c.font='italic 22px '+F;c.fillStyle='#8a968f';c.fillText('Study achievement certificate from AGRi Elite Arena. Not an official university document.',W/2,1030)}
V.ach=async function(){
 $('main').innerHTML='<h2>Badges &amp; certificates</h2><div id="ax"><p class="m">Loading…</p></div>';
 var rs=await sb.rpc('my_stats'),rb=await sb.rpc('my_badges'),nd=need(rb)||need(rs);if(nd){$('ax').innerHTML=nd;return}
 if(rb.error||rs.error){$('ax').innerHTML=msg((rb.error||rs.error).message);return}
 var s=(rs.data&&rs.data[0])||{},bs=rb.data||[],on=bs.filter(function(b){return b.earned}).length,st=X.st();
 var nm=(st.P&&st.P.full_name)||(st.U&&st.U.email&&st.U.email.split('@')[0])||'Student';
 var nextXp=function(l){return 50*l*(l+1)-0}; // XP needed for level l+1 : level=floor((1+sqrt(1+4x/50))/2)
 var need2=Math.max(0,nextXp(s.level)-s.xp);
 $('ax').innerHTML='<div class="card"><div class="grid"><div class="stat"><b>Lv '+(s.level||1)+'</b><span>'+(s.xp||0)+' XP · '+need2+' XP to next level</span></div><div class="stat"><b><svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 22c4 0 7-2.8 7-7 0-3-1.8-5-3.5-7C14.5 10 14 11 13 11c0-3-1-6-4-8 .3 3-1.5 5-3 7-1 1.5-1 3-1 4 0 4.2 3 8 7 8z"/></svg> '+(s.streak||0)+'</b><span>day streak</span></div><div class="stat"><b>'+(s.quizzes||0)+'</b><span>quizzes ('+(s.mocks||0)+' mock exams)</span></div><div class="stat"><b>'+on+'/'+bs.length+'</b><span>badges earned</span></div></div></div><div class="card"><p class="m" style="margin-top:0">Tap an earned badge to see and download your certificate.</p><div class="x-bg" id="abg"></div></div><div id="acert"></div>';
 var bg=$('abg');bs.forEach(function(b){var d=document.createElement('div');d.className='x-b '+(b.earned?'on':'off');d.innerHTML='<div class="ic">'+esc(b.icon)+'</div><b>'+esc(b.title)+'</b><small>'+esc(b.descr)+'</small>'+(b.earned?'<small style="color:var(--g);font-weight:700">Earned ✓</small>':'<div class="x-pg"><i style="width:'+Math.round(100*b.progress/b.goal)+'%"></i></div><small>'+b.progress+' / '+b.goal+'</small>');
  if(b.earned){d.tabIndex=0;d.setAttribute('role','button');d.setAttribute('aria-label','Certificate for '+b.title);var open=function(){cert(b)};d.onclick=open;d.onkeydown=function(e){if(e.key==='Enter'||e.key===' '){e.preventDefault();open()}}}
  bg.appendChild(d)});
 function cert(b){var dt=new Date().toLocaleDateString('en-GB',{day:'numeric',month:'long',year:'numeric'}),serial='AGRI-'+String(st.U.id).replace(/-/g,'').slice(0,6).toUpperCase()+'-'+b.key.toUpperCase();
  $('acert').innerHTML='<div class="card"><b><svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M22 10 12 5 2 10l10 5 10-5z"/><path d="M6 12v5c3 2 9 2 12 0v-5"/></svg> Certificate · '+esc(b.title)+'</b><p class="m">Your name comes from Profile. Change it there if needed.</p><canvas id="x-cv" aria-label="Certificate preview"></canvas><div class="x-row" style="margin-top:10px"><button class="btn" id="cdl">Download image</button><button class="btn s" id="csh" hidden>Share</button></div></div>';
  var cv=$('x-cv');drawCert(cv,nm,b,dt,serial);
  $('cdl').onclick=function(){cv.toBlob(function(bl){var a=document.createElement('a');a.href=URL.createObjectURL(bl);a.download='AGRi-Certificate-'+b.key+'.png';document.body.appendChild(a);a.click();setTimeout(function(){URL.revokeObjectURL(a.href);a.remove()},800)},'image/png')};
  if(navigator.canShare){cv.toBlob(function(bl){try{var f=new File([bl],'AGRi-Certificate-'+b.key+'.png',{type:'image/png'});if(navigator.canShare({files:[f]})){var sh=$('csh');sh.hidden=false;sh.onclick=function(){navigator.share({files:[f],title:'My AGRi Elite Arena certificate'}).catch(function(){})}}}catch(e){}},'image/png')}
  $('acert').scrollIntoView({behavior:'smooth',block:'nearest'})}
};

/* ───────────── extras: auto study plan, AI flashcards, weekly goal ───────────── */
function lsg(k,d){try{var v=JSON.parse(localStorage.getItem(k));return v==null?d:v}catch(e){return d}}
function lss(k,v){try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}}
function ymd(d){return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0')}
function mk(html,id){var d=document.createElement('div');d.className='card';d.id=id;d.innerHTML=html;return d}

/* 1. auto study plan -> writes normal planner tasks */
function planCard(){
 var m=$('main'),tf=$('tf');if(!tf||$('x-plan'))return;var anchor=tf.closest('.card');
 var c=mk('<b><svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M13 2 4 14h7l-1 8 9-12h-7z"/></svg> Make my study plan</b><p class="m" style="margin:4px 0 10px">Give your exam date and topics. It spreads them over the days left and adds them to your tasks below.</p><div class="x-row"><input id="xp-n" class="x-grow" placeholder="Exam name, e.g. AGF 101 Final" maxlength="40"><input id="xp-d" type="date" style="max-width:170px"></div><textarea id="xp-t" rows="5" placeholder="Topics, one per line (or separated by commas)" style="width:100%;margin-top:8px"></textarea><div class="x-row" style="margin-top:8px"><button class="btn" id="xp-go">Create plan</button><span class="m" id="xp-m"></span></div>','x-plan');
 m.insertBefore(c,anchor);
 var dt=new Date();dt.setDate(dt.getDate()+1);$('xp-d').min=ymd(dt);
 $('xp-go').onclick=async function(){
  var name=$('xp-n').value.trim()||'Exam',ds=$('xp-d').value,tp=$('xp-t').value.split(/[\n,;]+/).map(function(x){return x.trim()}).filter(Boolean).slice(0,120),out=$('xp-m');
  if(!ds){out.textContent='Choose the exam date.';return}if(!tp.length){out.textContent='Add at least one topic.';return}
  var t0=new Date();t0.setHours(0,0,0,0);var ex=new Date(ds+'T00:00:00'),n=Math.round((ex-t0)/864e5);
  if(n<1){out.textContent='The exam date must be in the future.';return}
  var sd=Math.max(1,Math.min(n-1,45)),first=new Date(ex);first.setDate(ex.getDate()-(sd+1));if(first<t0)first=t0;
  var rows=[],per={},i;for(i=0;i<tp.length;i++){var k=Math.min(sd-1,Math.floor(i*sd/tp.length));(per[k]=per[k]||[]).push(tp[i])}
  for(i=0;i<sd;i++){if(!per[i])continue;var d=new Date(first);d.setDate(first.getDate()+i);rows.push({user_id:X.st().U.id,title:'Study: '+per[i].join(', '),subject:name.slice(0,40),due_date:ymd(d)})}
  var rv=new Date(ex);rv.setDate(ex.getDate()-1);if(n>=2)rows.push({user_id:X.st().U.id,title:'Full revision + one mock exam',subject:name.slice(0,40),due_date:ymd(rv)});
  rows.push({user_id:X.st().U.id,title:'Exam day: quick look at key points, then rest',subject:name.slice(0,40),due_date:ds});
  this.disabled=true;var r=await sb.from('study_tasks').insert(rows);this.disabled=false;
  if(r.error){out.textContent=r.error.message;return}
  out.textContent='Done: '+rows.length+' tasks added.';X.go('plan')}
}

/* 2. AI flashcards from the student's own notes (saved on this device) */
function parseCards(t){t=String(t||'');var a=t.indexOf('['),b=t.lastIndexOf(']'),arr=null;
 if(a>-1&&b>a){try{arr=JSON.parse(t.slice(a,b+1))}catch(e){}}
 if(!arr){arr=[];(t.match(/\{[^{}]*\}/g)||[]).forEach(function(s){try{arr.push(JSON.parse(s))}catch(e){}})}
 return arr.filter(function(c){return c&&c.f&&c.b}).map(function(c){return{f:String(c.f).slice(0,300),b:String(c.b).slice(0,600)}})}
function cardsCard(){
 var m=$('main'),f=X.feat?X.feat():{};if($('x-mc')||!$('fb'))return;
 var c=mk('','x-mc');m.insertBefore(c,$('fb'));
 var deck=lsg('agri-mycards',[]),i=0,back=false;
 function draw(){
  var gen=f.ai?'<details'+(deck.length?'':' open')+'><summary><b><svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z"/><path d="M19 15l.8 2.2L22 18l-2.2.8L19 21l-.8-2.2L16 18l2.2-.8z"/></svg> My cards (AI)</b> <span class="m">'+deck.length+' saved on this device</span></summary><textarea id="xc-t" rows="5" data-voice placeholder="Paste your notes here (up to 3000 characters)" maxlength="3000" style="width:100%;margin-top:8px"></textarea><div class="x-row" style="margin-top:8px"><select id="xc-n" style="max-width:110px"><option>8</option><option selected>12</option><option>16</option></select><button class="btn" id="xc-go">Make cards</button><span class="m" id="xc-m"></span></div></details>':'';
  var rev='';if(deck.length){var d=deck[i];rev='<p class="m" style="margin:10px 0 4px">My card '+(i+1)+' / '+deck.length+'</p><div class="fc" id="xc-c">'+esc(back?d.b:d.f)+'</div><p class="m" style="text-align:center">Tap to flip</p><div class="x-row"><button class="btn s" id="xc-p">←</button><button class="btn s" id="xc-x">Delete card</button><button class="btn s" id="xc-r">Shuffle</button><button class="btn s" id="xc-nx">→</button></div>'}
  c.innerHTML=gen+rev;if(!gen&&!rev)c.style.display='none'}
 draw();
 c.onclick=async function(e){var t=e.target;
  if(t.id=='xc-c'){back=!back;draw()}
  else if(t.id=='xc-nx'){i=(i+1)%deck.length;back=false;draw()}
  else if(t.id=='xc-p'){i=(i-1+deck.length)%deck.length;back=false;draw()}
  else if(t.id=='xc-r'){deck=shuffle(deck);lss('agri-mycards',deck);i=0;back=false;draw()}
  else if(t.id=='xc-x'){deck.splice(i,1);lss('agri-mycards',deck);i=Math.max(0,Math.min(i,deck.length-1));back=false;draw()}
  else if(t.id=='xc-go'){
   var txt=$('xc-t').value.trim(),n=$('xc-n').value,o=$('xc-m');if(txt.length<80){o.textContent='Paste a longer note first.';return}
   t.disabled=true;o.textContent='Making cards…';
   var r=await aiBig('Make exactly '+n+' study flashcards from the notes below. Reply with ONLY a JSON array like [{"f":"question or term","b":"short clear answer"}]. Keep each answer under 40 words. Use the same language as the notes.\n\nNOTES:\n'+txt,'',Math.min(3000,150*n+500));
   t.disabled=false;var cs=r&&r.ok?parseCards(r.answer):[];
   if(!cs.length){o.textContent=(r&&r.error)||'Could not make cards. Try a shorter note.';return}
   deck=cs.concat(deck).slice(0,200);lss('agri-mycards',deck);i=0;back=false;draw()}}
}

/* 3. weekly study goal on the dashboard */
async function goalCard(){
 var m=$('main');if(!m||$('x-goal'))return;var c=mk('','x-goal');var a=$('x-dash');m.insertBefore(c,a?a.nextSibling:(m.children[1]||null));
 var goal=lsg('agri-goal',120),now=new Date(),dow=(now.getDay()+6)%7,mon=new Date(now);mon.setHours(0,0,0,0);mon.setDate(now.getDate()-dow);
 var mins=0;try{var r=await sb.from('study_sessions').select('minutes,created_at').gte('created_at',mon.toISOString());(r.data||[]).forEach(function(x){mins+=x.minutes||0});
  lsg('agri-ss',[]).forEach(function(x){if(x.created_at&&new Date(x.created_at)>=mon)mins+=x.minutes||0})}catch(e){}
 function draw(){var p=Math.min(100,Math.round(mins*100/goal));
  c.innerHTML='<div class="row"><b><svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1.2"/></svg> This week\'s study goal</b><span class="m">'+mins+' / '+goal+' min</span></div><div class="x-pg" style="height:10px"><i style="width:'+p+'%"></i></div><div class="x-row" style="margin-top:8px"><span class="m x-grow">'+(p>=100?'Goal reached. Great work!':'Use the Focus timer to add minutes.')+'</span><select id="xg-s" style="max-width:130px">'+[60,120,180,300,600].map(function(g){return'<option value="'+g+'"'+(g==goal?' selected':'')+'>'+g+' min</option>'}).join('')+'</select></div>';
  $('xg-s').onchange=function(){goal=+this.value;lss('agri-goal',goal);draw()}}
 draw()}

window.AgriViewExtra=async function(v){
 try{if(v=='plan')planCard();else if(v=='cards')cardsCard();else if(v=='dash')await goalCard()}catch(e){console.error(e)}};
/* quick shortcuts on the dashboard */
window.AgriDashExtra=function(){
 var m=$('main');if(!m||m.querySelector('#x-dash'))return;var f=X.feat?X.feat():{};
 var items=[];if(V.mock&&f.ai)items.push(['mock','<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 20h4L19 9l-4-4L4 16z"/><path d="m13.5 6.5 4 4"/></svg>','AI Mock Exam']);if(V.groups)items.push(['groups','<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><circle cx="9" cy="8" r="3.5"/><path d="M2.5 20c0-3.6 3-6 6.5-6s6.5 2.4 6.5 6"/><path d="M16 4.5a3.5 3.5 0 0 1 0 7M18 14c2.2.6 3.5 2.6 3.5 5"/></svg>','Study Groups']);if(V.ach)items.push(['ach','<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="9" r="6"/><path d="m8.5 14-1.5 7 5-3 5 3-1.5-7"/></svg>','Badges & Certificates']);if(!items.length)return;
 var d=document.createElement('div');d.id='x-dash';d.className='card';d.innerHTML='<b>Quick start</b><div class="x-row" style="margin-top:8px">'+items.map(function(i){return'<button class="btn s" data-xg="'+i[0]+'">'+i[1]+' '+i[2]+'</button>'}).join('')+'</div>';
 d.onclick=function(e){var b=e.target.closest('[data-xg]');if(b)X.go(b.dataset.xg)};
 m.insertBefore(d,m.children[1]||null)};
};
})();
