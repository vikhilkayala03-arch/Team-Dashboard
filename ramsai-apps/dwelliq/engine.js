(function (root) {
  'use strict';
  const cities = {
    Bengaluru: {state:'Karnataka',rate:6850,growth:8.4,demand:72,supply:46,areas:{Whitefield:1,Indiranagar:1.24,Sarjapur:0.94,'Electronic City':0.82}},
    Mumbai: {state:'Maharashtra',rate:18200,growth:6.8,demand:82,supply:39,areas:{Andheri:1,Bandra:1.38,Powai:1.17,Thane:0.7}},
    Hyderabad: {state:'Telangana',rate:5900,growth:7.2,demand:68,supply:58,areas:{Gachibowli:1.1,'Banjara Hills':1.3,Kondapur:1,Kukatpally:0.88}},
    Chennai: {state:'Tamil Nadu',rate:6200,growth:5.6,demand:64,supply:52,areas:{Adyar:1.25,Velachery:1,OMR:0.9,AnnaNagar:1.2}},
    Pune: {state:'Maharashtra',rate:6700,growth:7.6,demand:71,supply:54,areas:{Baner:1.1,Hinjewadi:0.92,Kharadi:1,Wakad:0.94}},
    Delhi: {state:'Delhi',rate:10400,growth:6.2,demand:75,supply:48,areas:{Dwarka:1,'Greater Kailash':1.42,Rohini:0.89,Saket:1.2}},
    Ahmedabad: {state:'Gujarat',rate:4300,growth:5.9,demand:62,supply:59,areas:{Satellite:1.1,Bopal:1,Navrangpura:1.18,'SG Highway':1.06}},
    Kolkata: {state:'West Bengal',rate:4800,growth:4.8,demand:60,supply:57,areas:{'New Town':1,'Salt Lake':1.18,Ballygunge:1.3,Rajarhat:0.86}}
  };
  const types=['Apartment','Independent house','Villa','Townhouse','Plot/Land'];
  const conditions={'New':0.08,'Excellent':0.05,'Good':0,'Average':-0.07,'Needs renovation':-0.17};
  const amenities=['Swimming pool','Gym','Garden','Security','Lift','Power backup','Clubhouse',"Children’s play area",'Smart home features','CCTV','Gated community','Parking','Nearby school','Nearby hospital','Nearby shopping','Public transport'];
  let rates={};
  function validate(p) {
    const errors=[];
    if(p.country!=='India') errors.push('This sample dataset supports India.');
    if(!Object.hasOwn(cities,p.city)) errors.push('Select a city in the sample dataset.');
    else if(p.state!==cities[p.city].state) errors.push('State must match the selected city.');
    if(!String(p.locality||'').trim() || String(p.locality).length>100) errors.push('Enter a locality with 1–100 characters.');
    if(!/^[1-9]\d{5}$/.test(p.pin)) errors.push('Enter a valid six-digit Indian PIN code.');
    if(!types.includes(p.type)) errors.push('Select a supported property type.');
    if(!Object.hasOwn(conditions,p.condition)) errors.push('Select a property condition.');
    if(!['Yes','No'].includes(p.parking)) errors.push('Select parking availability.');
    if(!['Furnished','Semi-furnished','Unfurnished'].includes(p.furnishing)) errors.push('Select furnishing.');
    const plot=p.type==='Plot/Land';
    for(const [key,min,max] of [['area',100,100000],['builtup',plot?0:50,100000],['carpet',plot?0:50,100000],['bedrooms',plot?0:1,20],['bathrooms',plot?0:1,20],['balconies',0,20],['floor',0,150],['floors',plot?0:1,150],['age',0,150]]) {
      if(!Number.isFinite(Number(p[key])) || Number(p[key])<min || Number(p[key])>max) errors.push(`${key}: enter a number between ${min} and ${max}.`);
      else if(!['area','builtup','carpet'].includes(key)&&!Number.isInteger(Number(p[key]))) errors.push(`${key}: use a whole number.`);
    }
    if(!plot && (Number(p.carpet)>Number(p.builtup)||Number(p.builtup)>Number(p.area))) errors.push('Carpet area must be ≤ built-up area ≤ total area.');
    if(!plot && Number(p.floor)>Number(p.floors)) errors.push('Floor number cannot exceed total floors.');
    if(!Array.isArray(p.amenities)||p.amenities.some(a=>!amenities.includes(a))) errors.push('Choose valid amenities.');
    return errors;
  }
  function predict(p) {
    const errors=validate(p); if(errors.length) throw new Error(errors.join(' '));
    const c=cities[p.city],plot=p.type==='Plot/Land',area=Number(p.area);
    const rate=rates[p.city]||c.rate,base=area*rate;
    const near=p.amenities.filter(a=>a.startsWith('Nearby')||a==='Public transport').length;
    const extras=p.amenities.filter(a=>!a.startsWith('Nearby')&&a!=='Public transport'&&a!=='Parking').length;
    const typePremium={'Apartment':0,'Independent house':0.12,'Villa':0.24,'Townhouse':0.09,'Plot/Land':-0.32}[p.type];
    const specs=[['Location',(Object.hasOwn(c.areas,p.locality)?c.areas[p.locality]:1)-1],['Property type',typePremium],['Size',area>2000?0.025:area<700?-0.02:0],['Bedrooms',plot?0:Math.min(0.06,Math.max(-0.03,(Number(p.bedrooms)-2)*0.018))],['Property age',plot?0:-Math.min(0.24,Number(p.age)*0.004)],['Amenities',plot?0:Math.min(0.12,extras*0.009)],['Nearby facilities',near*0.012],['Condition',plot?0:conditions[p.condition]],['Parking',plot?0:(p.parking==='Yes'||p.amenities.includes('Parking')?0.025:0)],['Furnishing',plot?0:({'Furnished':0.035,'Semi-furnished':0.015,'Unfurnished':0}[p.furnishing])],['Layout',plot?0:Math.max(-0.03,Math.min(0.03,(p.carpet/p.area-0.7)*0.08+(Number(p.bathrooms)-2)*0.006+Number(p.balconies)*0.003))],['Floor',plot?0:Math.min(0.018,Number(p.floor)*0.0015)]];
    const factors=specs.map(([name,percent])=>({name,percent:percent*100,amount:base*percent}));
    const raw=base+factors.reduce((s,f)=>s+f.amount,0),price=Math.round(raw);
    factors[factors.length-1].amount+=price-raw;
    const known=Object.hasOwn(c.areas,p.locality),uncertainty=known?0.15:0.23;
    return {price,min:Math.round(price*(1-uncertainty)),max:Math.round(price*(1+uncertainty)),perSqft:Math.round(price/area),confidence:known?82:64,base,rate,factors,marketPosition:price/area>rate*1.08?'Above sample average':price/area<rate*0.93?'Below sample average':'Near sample average',date:new Date().toISOString(),model:'Illustrative rules v1',property:{...p,amenities:[...p.amenities]}};
  }
  function setRates(input) {
    const next={};
    for(const [city,value] of Object.entries(input)) { if(!Object.hasOwn(cities,city)||!Number.isFinite(value)||value<500||value>100000) throw new Error('Rates must use supported city names and numbers from 500 to 100000.'); next[city]=value; }
    rates=next;
  }
  const api={cities,types,conditions,amenities,validate,predict,setRates,resetRates:()=>{rates={};},getRate:city=>rates[city]||cities[city].rate,getRates:()=>({...rates})};
  if(typeof module!=='undefined'&&module.exports) module.exports=api;
  root.ValuationEngine=api;
})(typeof window!=='undefined'?window:globalThis);
