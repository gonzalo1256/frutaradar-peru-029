(function(root){
  'use strict';
  const fruits={naranja:{name:'Naranja Valencia',family:'Naranja',icon:'◒',color:'#f4a340'},sandia:{name:'Sandía',family:'Sandía',icon:'◔',color:'#dd7868'},platano:{name:'Plátano bizcocho',family:'Plátano',icon:'◡',color:'#d6bd50'}};
  function day(s){if(!/^\d{4}-\d{2}-\d{2}$/.test(s))throw Error('Fecha inválida');const d=Date.parse(s+'T00:00:00Z');if(!Number.isFinite(d)||new Date(d).toISOString().slice(0,10)!==s)throw Error('Fecha inválida');return d/86400000;}
  function median(values){if(!values.length)return null;const v=[...values].sort((a,b)=>a-b),m=Math.floor(v.length/2);return v.length%2?v[m]:(v[m-1]+v[m])/2;}
  function validate(data){
    if(data.version!==2||!Array.isArray(data.sources)||!Array.isArray(data.observations)||!data.observations.length)throw Error('Formato no compatible');
    const ids=new Set(),seen=new Set();
    for(const s of data.sources){if(ids.has(s.id)||!/^https:\/\/cdn\.www\.gob\.pe\/uploads\/document\/file\/\d+\/[^?#]+\.pdf(?:\?[^#]*)?$/.test(s.url)||s.http_status!==200||s.method!=='direct-http-pdf'||!/^[a-f0-9]{64}$/.test(s.sha256))throw Error('Fuente no válida');ids.add(s.id);}
    for(const x of data.observations){day(x.date);const key=[x.date,x.fruit,x.market].join('|');if(seen.has(key)||!fruits[x.fruit]||!Number.isFinite(x.price)||x.price<=0||x.market!=='MMF2'||x.unit!=='PEN/kg'||x.level!=='mayorista'||!ids.has(x.source_id)||!['primera','no declarada'].includes(x.quality))throw Error('Observación no válida');seen.add(key);if(data.sources.find(s=>s.id===x.source_id).date!==x.date)throw Error('Fecha de fuente inconsistente');
      if(!['kilogramo','jaba','cajon'].includes(x.raw_unit)||!Number.isFinite(x.equivalent_kg)||x.equivalent_kg<=0||!Number.isFinite(x.raw_price_pen)||x.raw_price_pen<=0||Math.abs(x.price-x.raw_price_pen/x.equivalent_kg)>1e-9||(x.raw_unit==='kilogramo'&&x.equivalent_kg!==1))throw Error('Conversión no válida');
      if(!Number.isInteger(x.page)||x.page<2||x.page>6||(x.volume_t!==null&&(!Number.isFinite(x.volume_t)||x.volume_t<0)))throw Error('Volumen o página no válida');}
    return data;
  }
  function evaluate(data,fruit,asOf){
    const cutoff=day(asOf),rows=data.observations.filter(x=>x.fruit===fruit&&day(x.date)<=cutoff).sort((a,b)=>a.date.localeCompare(b.date));
    const latest=rows.at(-1)||null, recent=rows.filter(x=>day(x.date)>cutoff-28),coverage=new Set(recent.map(x=>x.date)).size;
    if(!latest)return{rows,latest,coverage,reference:null,decision:'Sin observaciones',confidence:'Insuficiente',reasons:['No hay precios publicados en el corte elegido.']};
    const age=cutoff-day(latest.date);
    const comparable=rows.filter(x=>x.date<latest.date&&day(x.date)>=day(latest.date)-28&&x.quality===latest.quality&&x.quality!=='no declarada');
    const reference=comparable.length>=21?median(comparable.map(x=>x.price)):null;
    const reasons=[];
    if(age>2)reasons.push('El último precio tiene más de 2 días de antigüedad.');
    if(latest.quality==='no declarada')reasons.push('La publicación más reciente no declara la calidad; falta homologarla.');
    if(comparable.length<21)reasons.push('No hay 21 días previos con calidad explícita homologada para calcular una referencia comparable.');
    if(latest.volume_t===null||latest.volume_t===undefined)reasons.push('No hay abastecimiento por fruta para esta observación.');
    reasons.push('Falta confirmar origen del lote y revisar riesgos de su ruta.');
    const decision=age>2?'Precio desactualizado':reference!==null&&latest.price<=reference*.9?'Precio observado bajo; confirmar contexto':'Consultar precio, esperar evidencia';
    return{rows,latest,age,coverage,reference,comparable:comparable.length,decision,confidence:reference!==null&&age<=2?'Media para precio; insuficiente para compra':'Limitada',reasons};
  }
  function estimate(price,kg){if(!Number.isFinite(kg)||kg<=0||kg>1000||!Number.isFinite(price)||price<=0)throw Error('Ingresa entre 0,01 y 1000 kg');return Math.round(price*kg*100)/100;}
  function report(data,fruit,asOf){return {initiative:'029',policy_version:'0.2',name:'FrutaRadar Perú / Peru Fruit Radar',as_of:asOf,scope:data.scope,fruit:fruits[fruit].name,analysis:evaluate(data,fruit,asOf),sources:data.sources.filter(s=>data.observations.some(x=>x.fruit===fruit&&x.source_id===s.id&&x.date<=asOf)),press_comparisons:(data.press_comparisons||[]).filter(x=>x.fruit===fruit&&x.date<=asOf),limitations:['Reportes diarios oficiales; días sin publicación no se interpolan. Calidad no declarada en el reporte.','Referencia mayorista normalizada con equivalencia publicada, no cotización minorista ni predicción.','Alertas actuales y vínculo origen-ruta-destino no evaluados.'],dataset_collected_at:data.collected_at};}
  const api={fruits,day,median,validate,evaluate,estimate,report};if(typeof module!=='undefined'&&module.exports)module.exports=api;root.FrutaRadar=api;
})(typeof window!=='undefined'?window:globalThis);
