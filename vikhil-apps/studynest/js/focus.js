/* Pomodoro timer + noise generated live with the Web Audio API (no audio files). */
let mode='focus',left=25*60,total=25*60,tick=null,actx,src,gain;
const fmt=s=>String(Math.floor(s/60)).padStart(2,'0')+':'+String(s%60).padStart(2,'0');
function draw(){$('#clock').textContent=fmt(left);$('#pbar').style.width=(100-left/total*100)+'%';document.title=tick?fmt(left)+' · StudyNest':'StudyNest | Study Smarter'}
function setMode(m){mode=m;total=left=(m==='focus'?+$('#fMin').value:+$('#bMin').value)*60;draw()}
function beep(){try{actx=actx||new (window.AudioContext||window.webkitAudioContext)();const o=actx.createOscillator(),g=actx.createGain();o.frequency.value=880;g.gain.value=.15;o.connect(g);g.connect(actx.destination);o.start();o.stop(actx.currentTime+.5)}catch(e){}}
function done(){clearInterval(tick);tick=null;beep();
 if(mode==='focus'){const log=Store.get('focus',{}),k=dayKey();log[k]=(log[k]||0)+Math.round(total/60);Store.set('focus',log);markStudied();setMode('break')}else setMode('focus');
 $('#startT').textContent='Start';draw();if(window.refreshHome)refreshHome()}
$('#startT').onclick=()=>{if(tick){clearInterval(tick);tick=null;$('#startT').textContent='Resume'}else{$('#startT').textContent='Pause';tick=setInterval(()=>{left--;draw();if(left<=0)done()},1000)}draw()};
$('#resetT').onclick=()=>{clearInterval(tick);tick=null;$('#startT').textContent='Start';setMode('focus')};
['fMin','bMin'].forEach(i=>$('#'+i).onchange=()=>{if(!tick)setMode(mode)});
function stopNoise(){if(src){try{src.stop()}catch(e){}src=null}}
function startNoise(type){actx=actx||new (window.AudioContext||window.webkitAudioContext)();stopNoise();if(actx.state==='suspended')actx.resume();
 const len=actx.sampleRate*3,buf=actx.createBuffer(1,len,actx.sampleRate),d=buf.getChannelData(0);let last=0;
 for(let i=0;i<len;i++){const w=Math.random()*2-1;if(type==='brown'){last=(last+.02*w)/1.02;d[i]=last*3.5}else d[i]=w*.5}
 src=actx.createBufferSource();src.buffer=buf;src.loop=true;const f=actx.createBiquadFilter();f.type=type==='rain'?'bandpass':'lowpass';f.frequency.value=type==='rain'?3200:700;
 gain=actx.createGain();gain.gain.value=$('#vol').value/100;src.connect(f);f.connect(gain);gain.connect(actx.destination);src.start()}
$$('[data-snd]').forEach(b=>b.onclick=()=>b.dataset.snd==='off'?stopNoise():startNoise(b.dataset.snd));
$('#vol').oninput=()=>{if(gain)gain.gain.value=$('#vol').value/100};
draw();
