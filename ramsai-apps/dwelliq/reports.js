(function(root){
  'use strict';
  // Dependency-free PDF writer. ASCII text keeps PDF byte offsets portable.
  const ascii=s=>String(s??'').replace(/₹/g,'INR ').replace(/²/g,'2').replace(/[–—−]/g,'-').replace(/[‘’]/g,"'").replace(/[“”]/g,'"').replace(/≤/g,'<=').replace(/[^\x20-\x7e\n]/g,' ');
  const escape=s=>ascii(s).replace(/\\/g,'\\\\').replace(/\(/g,'\\(').replace(/\)/g,'\\)');
  const cash=n=>'INR '+Math.round(n).toLocaleString('en-IN');
  function pdf(r){
    const p=r.property,lines=[];
    const add=(text='',heading=false)=>{const words=ascii(text).split(/\s+/);let line='';for(const word of words){if((line+' '+word).length>85&&line){lines.push({text:line,heading});line=word;}else line+=(line?' ':'')+word;}lines.push({text:line,heading});};
    add('PROPERTY VALUATION REPORT',true);add('DwellIQ | Sample property intelligence');add('Prediction date: '+new Date(r.date).toLocaleDateString('en-IN'));add('Model: '+r.model+' | No trained AI or live market data connected.');add();
    add('Estimated property value: '+cash(r.price),true);add('Estimated range: '+cash(r.min)+' - '+cash(r.max));add('Price per sq.ft: '+cash(r.perSqft));add('Illustrative confidence: '+r.confidence+'% (data coverage, not measured accuracy)');add('Market position: '+r.marketPosition);add();
    add('Property details',true);
    const fields={country:'Country',state:'State',city:'City',locality:'Locality',pin:'PIN code',landmark:'Landmark',type:'Property type',bedrooms:'Bedrooms',bathrooms:'Bathrooms',balconies:'Balconies',area:'Total area (sq.ft)',builtup:'Built-up area (sq.ft)',carpet:'Carpet area (sq.ft)',floor:'Floor number',floors:'Total floors',age:'Property age (years)',parking:'Parking',furnishing:'Furnishing',condition:'Condition'};
    for(const [key,label]of Object.entries(fields))add(label+': '+(p[key]===''?'Not specified':p[key]));
    add('Amenities: '+(p.amenities.join(', ')||'None selected'));add();
    add('Price influencing factors',true);add('Base value (total area x city sample rate): '+cash(r.base));
    for(const f of r.factors)add(f.name+': '+(f.percent>=0?'+':'')+f.percent.toFixed(1)+'% | '+(f.amount>=0?'+':'-')+cash(Math.abs(f.amount)));
    add('All adjustments apply to the base value. Rounding is reconciled in the final factor.');add();
    add('Market analysis (illustrative)',true);const m=r.market||{};add('Selected city: '+p.city+' | Sample rate: '+cash(m.rate)+' / sq.ft');add('Average benchmark (1,450 sq.ft): '+cash(m.rate*1450));add('Year-over-year change: +'+m.growth+'% | Trend: Increasing');add('Demand index: '+m.demand+'/100 | Supply index: '+m.supply+'/100');add('Trends and indices are synthetic examples, not observed market measurements.');add();
    add('Comparable properties (sample listings)',true);for(const c of r.comparables||[]){add(c.name+' | '+c.locality+', '+c.city);add(c.type+' | '+c.bedrooms+' bedrooms | '+c.area+' sq.ft | Distance: '+c.distance+' km');add('Sample price: '+cash(c.price)+' | '+cash(c.rate)+'/sq.ft');}add();
    add('Disclaimer',true);add(r.disclaimer);add('This report uses illustrative sample rates and a rules engine. Confidence and price ranges are not statistically calibrated. Comparable names, prices and distances are synthetic. Verify current sales and obtain a professional appraisal before acting.');
    const pages=[];for(let i=0;i<lines.length;i+=43)pages.push(lines.slice(i,i+43));
    const objects=[];objects[1]='<< /Type /Catalog /Pages 2 0 R >>';objects[3]='<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>';objects[4]='<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>';
    const kids=[];
    pages.forEach((page,i)=>{const pageId=5+i*2,streamId=pageId+1;kids.push(pageId+' 0 R');let stream='0.09 0.23 0.18 rg\n44 792 507 7 re f\nBT /F2 18 Tf 44 759 Td (DwellIQ) Tj ET\n';
      page.forEach((line,j)=>{stream+=`BT /${line.heading?'F2':'F1'} ${line.heading?11:9} Tf 0.12 0.22 0.18 rg 44 ${731-j*15} Td (${escape(line.text)}) Tj ET\n`;});
      stream+=`BT /F1 8 Tf 0.45 0.5 0.46 rg 44 40 Td (DwellIQ | Illustrative sample estimate | Page ${i+1} of ${pages.length}) Tj ET\n`;
      objects[pageId]=`<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 3 0 R /F2 4 0 R >> >> /Contents ${streamId} 0 R >>`;
      objects[streamId]=`<< /Length ${stream.length} >>\nstream\n${stream}endstream`;
    });
    objects[2]=`<< /Type /Pages /Kids [${kids.join(' ')}] /Count ${pages.length} >>`;
    let content='%PDF-1.4\n',offsets=[0];for(let i=1;i<objects.length;i++){offsets[i]=content.length;content+=`${i} 0 obj\n${objects[i]}\nendobj\n`;}
    const start=content.length;content+=`xref\n0 ${objects.length}\n0000000000 65535 f \n`;for(let i=1;i<objects.length;i++)content+=String(offsets[i]).padStart(10,'0')+' 00000 n \n';content+=`trailer\n<< /Size ${objects.length} /Root 1 0 R >>\nstartxref\n${start}\n%%EOF`;
    return new TextEncoder().encode(content);
  }
  const api={pdf};root.DwellReports=api;if(typeof module!=='undefined'&&module.exports)module.exports=api;
})(typeof window!=='undefined'?window:globalThis);
