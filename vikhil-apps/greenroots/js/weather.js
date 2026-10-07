/* Live weather from Open-Meteo (free, no API key). Advice is rule-based. */
$('#city').innerHTML='<option value="">Or pick a city…</option>'+Object.keys(CITIES).map(c=>`<option>${c}</option>`).join('');
const WX={0:'Clear',1:'Mostly clear',2:'Partly cloudy',3:'Cloudy',45:'Fog',48:'Fog',51:'Light drizzle',53:'Drizzle',55:'Heavy drizzle',61:'Light rain',63:'Rain',65:'Heavy rain',80:'Showers',81:'Showers',82:'Heavy showers',95:'Thunderstorm'};
async function loadWx(lat,lon,label){const out=$('#wxOut');out.innerHTML='<div class="card">Loading forecast…</div>';
 try{const r=await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code&daily=temperature_2m_max,temperature_2m_min,precipitation_sum,weather_code&forecast_days=4&timezone=auto`);
  const d=await r.json(),c=d.current,rain=d.daily.precipitation_sum,tips=[];
  if(rain[0]>5||rain[1]>5)tips.push('🌧️ Rain expected soon. Skip irrigation and fertiliser, since it would wash away.');
  if(c.wind_speed_10m>20)tips.push('💨 Strong wind. Do not spray pesticides now; drift wastes product.');
  if(c.temperature_2m>36)tips.push('🔥 Very hot. Irrigate in the evening and mulch to protect roots.');
  if(c.relative_humidity_2m>80&&(rain[0]>0||rain[1]>0))tips.push('🍄 Humid and wet. Fungal disease risk is high; inspect leaves.');
  if(c.temperature_2m<8)tips.push('❄️ Cold. Protect young plants from frost.');
  if(!tips.length)tips.push('✅ Conditions look fine for normal field work.');
  out.innerHTML=`<div class="card"><p class="sub" style="margin:0">${label}</p><div class="stat">${Math.round(c.temperature_2m)}°C <span style="font-size:1rem;font-family:DM Sans">${WX[c.weather_code]||''} · humidity ${c.relative_humidity_2m}% · wind ${Math.round(c.wind_speed_10m)} km/h</span></div></div>
  <div class="grid g3" style="margin:0">${d.daily.time.slice(1,4).map((t,i)=>`<div class="card"><b>${new Date(t).toLocaleDateString('en',{weekday:'long'})}</b><p>${WX[d.daily.weather_code[i+1]]||''}</p><p>${Math.round(d.daily.temperature_2m_min[i+1])}–${Math.round(d.daily.temperature_2m_max[i+1])}°C · rain ${rain[i+1]} mm</p></div>`).join('')}</div>
  <div class="card"><h3>Farm advice</h3><ul style="margin:8px 0 0 18px">${tips.map(t=>`<li>${t}</li>`).join('')}</ul></div>`}
 catch(e){out.innerHTML='<div class="card">Could not load the forecast. Check your internet connection and try again.</div>'}}
$('#geo').onclick=()=>navigator.geolocation?navigator.geolocation.getCurrentPosition(p=>loadWx(p.coords.latitude,p.coords.longitude,'Your location'),()=>{$('#wxOut').innerHTML='<div class="card">Location was blocked. Pick a city instead.</div>'}):($('#wxOut').innerHTML='<div class="card">This browser has no location support. Pick a city.</div>');
$('#city').onchange=e=>{const c=CITIES[e.target.value];if(c)loadWx(c[0],c[1],e.target.value)};
