'use strict';
const F=window.FrutaRadar,$=id=>document.getElementById(id);
const escapeHTML=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const money=n=>new Intl.NumberFormat('es-PE',{style:'currency',currency:'PEN',minimumFractionDigits:2}).format(n);
const date=s=>new Date(s+'T12:00:00Z').toLocaleDateString('es-PE',{day:'2-digit',month:'short',year:'numeric',timeZone:'America/Lima'});
const today=new Intl.DateTimeFormat('en-CA',{year:'numeric',month:'2-digit',day:'2-digit',timeZone:'America/Lima'}).format(new Date());
let data,marketData,retailData,runStatus,schedule,fruit='naranja';
function source(id){return data.sources.find(s=>s.id===id);}
function link(id,label,page){return `<a href="${escapeHTML(source(id).url)}${page?'#page='+page:''}" target="_blank" rel="noopener noreferrer">${escapeHTML(label)} ↗</a>`;}
function conversion(row){return `${money(row.raw_price_pen)} / ${row.raw_unit} de ${row.equivalent_kg} kg = ≈ ${row.price.toFixed(6)} S/kg`;}
function timeLabel(s){return s?new Date(s).toLocaleString('es-PE',{timeZone:'America/Lima'}).replace(/\.$/,''):'sin registro';}
function renderStatus(){
  const latest=data.observations.map(x=>x.date).sort().at(-1),stale=F.day(today)-F.day(latest)>2;
  const state=runStatus?.run_status==='failed'?'Última ejecución fallida; se conserva la copia válida':runStatus?.run_status==='running'?'Actualización en curso':runStatus?.run_status==='success'?'Última ejecución correcta':'Estado de ejecución no disponible';
  const scheduled=schedule?.status==='ACTIVE'?'Diaria 11:00 · Lima':'Programación sin confirmar';
  $('update-status').textContent=`${scheduled} · ${state}. Última ejecución: ${timeLabel(runStatus?.last_run_at)}. Éxito: ${timeLabel(runStatus?.last_success_at)}. Cambio de datos: ${timeLabel(runStatus?.last_data_change_at)}. ${stale?'DATOS DESACTUALIZADOS: más de 2 días.':''} Equipo y Codex deben estar disponibles; recarga para leer novedades.`;
  $('update-status').classList.toggle('warning',stale||runStatus?.run_status==='failed');
}
function showView(){const view=['radar','productos','retail','calendario','fuentes'].includes(location.hash.slice(1))?location.hash.slice(1):'radar';document.querySelectorAll('.view').forEach(el=>el.hidden=el.id!==view);document.querySelectorAll('[data-view]').forEach(el=>{el.classList.toggle('active',el.dataset.view===view);if(el.dataset.view===view)el.setAttribute('aria-current','page');else el.removeAttribute('aria-current');});}
function chart(rows){
  if(!rows.length){$('chart').innerHTML='<p class="muted">Sin observaciones para este periodo. Prueba otro corte o el histórico completo.</p>';return;}
  const w=620,h=240,left=45,right=25,top=28,bottom=47;
  let min=Math.min(...rows.map(x=>x.price)),max=Math.max(...rows.map(x=>x.price));const pad=Math.max((max-min)*.3,.08);min=Math.max(0,min-pad);max+=pad;
  let start=F.day(rows[0].date),end=F.day(rows.at(-1).date);if(start===end){start--;end++;}
  const px=x=>left+(F.day(x.date)-start)/(end-start)*(w-left-right),py=n=>top+(max-n)/(max-min)*(h-top-bottom);
  let svg=`<svg viewBox="0 0 ${w} ${h}" role="img" aria-label="Precios publicados de ${F.fruits[fruit].name}. ${rows.length} observaciones; sin interpolación."><title>Precios mayoristas observados, S/ por kg</title>`;
  for(let i=0;i<4;i++){const n=min+(max-min)*i/3,y=py(n);svg+=`<line x1="${left}" y1="${y}" x2="${w-right}" y2="${y}" stroke="#e8ecdf"/><text x="${left-8}" y="${y+4}" text-anchor="end">${n.toFixed(2)}</text>`;}
  for(const x of rows)svg+=`<circle class="dot-price" cx="${px(x)}" cy="${py(x.price)}" r="6" fill="${F.fruits[fruit].color}"><title>${date(x.date)} · ${money(x.price)}/kg · ${escapeHTML(x.quality)}</title></circle>`;
  const labels=rows.length===1?[rows[0]]:[rows[0],rows.at(-1)];
  for(const [i,x] of labels.entries())svg+=`<text x="${px(x)}" y="${h-18}" text-anchor="${labels.length===1?'middle':i===0?'start':'end'}">${date(x.date)}</text>`;
  if(end-start>60)svg+=`<text x="${w/2}" y="${h-52}" text-anchor="middle">Muestra discontinua · meses sin datos</text>`;
  svg+='</svg>';$('chart').innerHTML=svg;
}
function renderEstimate(){
  const result=F.evaluate(data,fruit,$('asof').value);
  try{if(!result.latest)throw Error('No hay precio para este corte');$('estimate').textContent=money(F.estimate(result.latest.price,Number($('kg').value)));$('estimate-note').textContent=`${conversion(result.latest)}. Cálculo de ${$('kg').value} kg con el cociente sin redondear (${date(result.latest.date)}); total redondeado a céntimos. Referencia mayorista sin flete, merma, margen minorista ni disponibilidad por esa cantidad.`;}
  catch(e){$('estimate').textContent='—';$('estimate-note').textContent=e.message;}
}
function render(){
  const asOf=$('asof').value;if(!asOf||asOf>today){$('asof').value=today;return render();}
  $('fruit-cards').innerHTML=Object.entries(F.fruits).map(([id,f])=>{const a=F.evaluate(data,id,asOf);return `<button class="fruit-card ${id===fruit?'selected':''}" data-fruit="${id}" aria-pressed="${id===fruit}"><span class="fruit-name">${f.name}</span><span class="fruit-symbol" style="color:${f.color}" aria-hidden="true">${f.icon}</span><span class="price">${a.latest?money(a.latest.price):'—'} <small>/ kg</small></span><span class="meta">${a.latest?'Publicado: '+date(a.latest.date):'Sin dato en el corte'}</span><span class="tag">${a.latest?(a.age<=2?'OFICIAL · RECIENTE':'OFICIAL · HISTÓRICO'):'SIN OBSERVACIONES'}</span></button>`;}).join('');
  const a=F.evaluate(data,fruit,asOf);$('history-title').textContent=F.fruits[fruit].name;
  let rows=a.rows;if($('period').value==='28')rows=rows.filter(x=>F.day(x.date)>F.day(asOf)-28);
  chart(rows);$('history-rows').innerHTML=rows.map(x=>`<tr><td>${date(x.date)}</td><td>≈ ${money(x.price)}</td><td>${escapeHTML(conversion(x))}</td><td>${x.volume_t??'Sin dato'}</td><td>${escapeHTML(x.quality)}</td><td>${link(x.source_id,'PDF p. '+x.page,x.page)}</td></tr>`).join('')||'<tr><td colspan="6">Sin registros en este periodo.</td></tr>';
  $('confidence').textContent='Confianza: '+a.confidence;$('decision-title').textContent=a.decision;$('reasons').innerHTML=a.reasons.map(r=>`<li>${escapeHTML(r)}</li>`).join('');$('coverage-text').textContent=`${a.coverage}/28 días`;$('coverage-bar').style.width=(a.coverage/28*100)+'%';
  const supply=a.latest;$('supply').innerHTML=supply?`<div class="supply-number">${supply.volume_t!==null?new Intl.NumberFormat('es-PE').format(supply.volume_t):'—'} <small>toneladas · ${F.fruits[fruit].name}</small></div><div class="supply-line">${date(supply.date)} · ${link(supply.source_id,'PDF p. '+supply.page,supply.page)}</div>`:'<p>Sin volumen para este corte.</p>';
  renderEstimate();
}
function renderCalendar(){
  const months=['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Set','Oct','Nov','Dic'],region=$('region').value;
  const peak=region==='selva'?[10,11,12,1,2,3]:[2,3,4,5];
  $('calendar').innerHTML='<table class="calendar-table"><thead><tr><th>Cultivo / alcance</th>'+months.map(m=>`<th>${m}</th>`).join('')+'</tr></thead><tbody>'+Object.entries(F.fruits).map(([id,f])=>`<tr><th>${f.family}${id==='platano'?'<br><small>General; no solo bizcocho</small>':''}</th>`+months.map((_,i)=>`<td class="season ${id==='platano'?(peak.includes(i+1)?'high':''):'unknown'}" title="${id==='platano'?(peak.includes(i+1)?'Mayor producción habitual':'Producción habitual'):'Sin calendario validado'}">${id==='platano'?(peak.includes(i+1)?'●':'·'):'?'}</td>`).join('')+'</tr>').join('')+'</tbody></table>';
  $('calendar-context').textContent=region==='selva'?'Plátano, selva: producción anual; mayor producción habitual de octubre a marzo según la guía histórica de SENASA. No demuestra oferta actual de bizcocho en Lima.':'Plátano, costa: mayor producción habitual de febrero a mayo según la guía histórica de SENASA. No demuestra oferta actual de bizcocho en Lima.';
}
function renderSources(){
  const latest=data.observations.map(x=>x.date).sort().at(-1);$('dataset-summary').textContent=`${data.observations.length} precios · ${data.sources.length} publicaciones · último dato ${date(latest)}`;
  const catalogCount=marketData?.catalog.filter(x=>x.coverage==='precio_observado').length||3;
  $('source-metrics').innerHTML=[[catalogCount,'productos con precio mayorista'],[marketData?.observations.length||data.observations.length,'observaciones mayoristas'],[marketData?.sources.length||data.sources.length,'PDF oficiales'],[retailData?.observations.length||0,'precios retail online']].map(([n,t])=>`<div class="metric"><strong>${Number(n).toLocaleString('es-PE')}</strong>${t}</div>`).join('');
  const lastMarket=marketData?.coverage.last_report_date||latest;
  $('coverage-summary').textContent=`Último precio del histórico de frutas: ${date(latest)}. Último boletín conjunto: ${date(lastMarket)}. Consulta mayorista en Lima: ${new Date(marketData?.collected_at||data.collected_at).toLocaleString('es-PE',{timeZone:'America/Lima'})}. La cobertura incluye MMF2 y GMML; cada registro muestra su mercado. La instantánea minorista se tomó ${retailData?timeLabel(retailData.captured_at):'sin fecha disponible'} y conserva tienda, unidad y enlace por producto.`;
  if($('market-source-list'))$('market-source-list').innerHTML='<div class="panel"><h2>Boletines diarios conjuntos de MIDAGRI</h2>'+marketData.sources.filter(s=>s.id.startsWith('midagri-combined-')).slice().reverse().map(s=>`<article class="source-card"><p class="eyebrow">${date(s.date)} · GMML Y MMF2 · PDF · HTTP ${s.http_status}</p><h2><a href="${escapeHTML(s.url)}" target="_blank" rel="noopener noreferrer">${escapeHTML(s.title)} ↗</a></h2><p>${marketData.observations.filter(x=>x.source_id===s.id).length} observaciones referidas desde la tabla diaria. Huella SHA-256 de la copia consultada: ${escapeHTML(s.sha256.slice(0,16))}…</p></article>`).join('')+'</div>';
  $('press-comparisons').innerHTML='<table><thead><tr><th>Fecha / fruta</th><th>PDF S/kg</th><th>Prensa S/kg</th><th>Resultado</th></tr></thead><tbody>'+(data.press_comparisons||[]).map(x=>`<tr><td>${date(x.date)} · ${F.fruits[x.fruit].name}</td><td>${link(x.pdf_source_id,x.pdf_price.toFixed(6))}</td><td><a href="${escapeHTML(x.press_url)}" target="_blank" rel="noopener noreferrer">${money(x.press_price)} ↗</a></td><td>${x.status==='discrepancia'?'DISCREPANCIA · se conserva PDF':'Coincide al céntimo'}</td></tr>`).join('')+'</tbody></table>';
  $('source-list').innerHTML=[...data.sources].reverse().map(s=>`<article class="source-card"><p class="eyebrow">${date(s.date)} · MIDAGRI · PDF · HTTP ${s.http_status}</p><h2>${link(s.id,s.title)}</h2><p class="muted">${data.observations.filter(x=>x.source_id===s.id).map(x=>`${F.fruits[x.fruit].name}: ≈ ${money(x.price)}/kg · ${x.volume_t??'sin dato'} t`).join(' · ')}</p><details><summary>Ver filas originales, conversiones y huella del PDF</summary>${data.observations.filter(x=>x.source_id===s.id).map(x=>`<p class="muted">Página ${x.page}: ${escapeHTML(conversion(x))}</p>`).join('')}${[...new Set(s.excerpts)].map(t=>`<blockquote>${escapeHTML(t)}</blockquote>`).join('')}<p class="tiny">Recuperado: ${escapeHTML(s.retrieved_at)} · PDF oficial consultado. La huella registra el contenido recibido, no certifica la metodología del publicador.</p><code>SHA-256: ${s.sha256}</code></details></article>`).join('');
  if($('retail-source-summary'))$('retail-source-summary').innerHTML=retailData?`<div class="panel"><h2>Snapshot de supermercados</h2><p>${retailData.observations.length} precios listados en ${[...new Set(retailData.observations.map(x=>x.retailer))].length} retailers. Captura: ${timeLabel(retailData.captured_at)}. Es una referencia online estática; no se actualiza con la tarea diaria de MIDAGRI.</p><p>${retailData.coverage.note}</p><a href="retail-data.json">Descargar observaciones minoristas y fuentes</a></div>`:'<div class="panel"><h2>Snapshot de supermercados</h2><p>No se pudo cargar retail-data.json.</p></div>';
}
const categoryNames={fruta:'Frutas',verdura:'Verduras y hortalizas',tuberculo:'Tubérculos y raíces',raiz_condimento:'Raíces y condimentos',hierba:'Hierbas'};
function selectOptions(el,items,allLabel,selected){el.innerHTML=`<option value="">${escapeHTML(allLabel)}</option>`+items.map(x=>`<option value="${escapeHTML(x.value)}">${escapeHTML(x.label)}</option>`).join('');if(items.some(x=>x.value===selected))el.value=selected;}
function marketFilters(){
  if(!marketData)return;
  const keep={category:$('market-category').value,product:$('market-product').value,variety:$('market-variety').value,market:$('market-market').value,date:$('market-date').value};
  const cats=[...new Set(marketData.catalog.map(x=>x.category))].map(x=>({value:x,label:categoryNames[x]||x}));selectOptions($('market-category'),cats,'Todas',keep.category);
  const category=$('market-category').value;
  const products=marketData.catalog.filter(x=>!x.parent_id&&(!category||x.category===category));
  selectOptions($('market-product'),products.map(x=>({value:x.id,label:x.name})),'Todos',keep.product);
  const product=$('market-product').value,cat=$('market-category').value;
  const scope=marketData.observations.filter(x=>(!cat||x.category===cat)&&(!product||x.product_id===product)&&(!keep.market||x.market===keep.market)&&(!keep.date||x.date===keep.date));
  const varieties=[...new Set(scope.map(x=>x.variety))].sort((a,b)=>a.localeCompare(b,'es'));
  const virtual=marketData.catalog.filter(x=>x.parent_id&&(!product||x.parent_id===product)&&(!cat||x.category===cat));
  selectOptions($('market-variety'),[...varieties.map(x=>({value:x,label:x})),...virtual.map(x=>({value:x.id,label:x.name+' · sin atributo/precio confirmado'}))],'Todas',keep.variety);
  const markets=[...new Set(marketData.observations.map(x=>x.market))].map(x=>({value:x,label:x==='GMML'?'GMML · Gran Mercado Mayorista de Lima':'MMF2 · Mercado Mayorista de Frutas N.º 2'}));selectOptions($('market-market'),markets,'Todos',keep.market);
  const dates=[...new Set(marketData.observations.map(x=>x.date))].sort().reverse();selectOptions($('market-date'),dates.map(x=>({value:x,label:date(x)})),'Todas las fechas',keep.date||dates[0]||'');
}
function renderMarket(){
  if(!marketData)return;
  marketFilters();
  const category=$('market-category').value,product=$('market-product').value,variety=$('market-variety').value,market=$('market-market').value,asOf=$('market-date').value;
  const virtual=marketData.catalog.find(x=>x.id===variety&&x.coverage==='atributo_no_confirmado');
  let rows=marketData.observations.filter(x=>(!category||x.category===category)&&(!product||x.product_id===product)&&(!market||x.market===market)&&(!asOf||x.date===asOf)&&(!variety||x.variety===variety));
  const pricedProducts=marketData.catalog.filter(x=>x.coverage==='precio_observado').length;
  $('market-summary').textContent=`${marketData.catalog.length} opciones · ${pricedProducts} con precio observado · último boletín ${marketData.coverage.last_report_date?date(marketData.coverage.last_report_date):'sin fecha'}`;
  $('market-stats').textContent=`${marketData.observations.length.toLocaleString('es-PE')} precios observados · ${marketData.sources.length} boletines/PDF fuente`;
  $('market-result-count').textContent=`${rows.length.toLocaleString('es-PE')} observaciones`;
  const selectedProduct=marketData.catalog.find(x=>x.id===product);
  const productNote=selectedProduct?.coverage==='sin_precio_en_fuente'?selectedProduct.coverage_note:'';
  const note=virtual?virtual.coverage_note:productNote||marketData.coverage.note;
  $('market-coverage-note').textContent=note+(marketData.coverage.report_failures?.length?` · Algunos PDF no se pudieron leer: ${marketData.coverage.report_failures.length}.`:"");
  const groups=new Map();
  for(const x of rows){const key=[x.date,x.product_id,x.variety].join('|');if(!groups.has(key))groups.set(key,{date:x.date,category:x.category,product:x.product,variety:x.variety,prices:{},sources:[]});const g=groups.get(key);g.prices[x.market]=x.price_per_kg;g.sources.push(x);}
  const emptyMessage=virtual?'No hay observaciones para el atributo solicitado. La fuente no lo confirma.':productNote||'No hay observaciones que coincidan con los filtros.';
  $('market-comparisons').innerHTML=[...groups.values()].sort((a,b)=>b.date.localeCompare(a.date)||a.product.localeCompare(b.product,'es')||a.variety.localeCompare(b.variety,'es')).map(g=>{const gm=g.prices.GMML,mm=g.prices.MMF2,delta=Number.isFinite(gm)&&Number.isFinite(mm)?money(gm-mm):'—';return `<tr><td>${date(g.date)}</td><td>${escapeHTML(categoryNames[g.category]||g.category)} · ${escapeHTML(g.product)}</td><td>${escapeHTML(g.variety)}</td><td>${Number.isFinite(gm)?money(gm):'—'}</td><td>${Number.isFinite(mm)?money(mm):'—'}</td><td>${delta}</td></tr>`;}).join('')||`<tr><td colspan="6">${escapeHTML(emptyMessage)}</td></tr>`;
  $('market-observations').innerHTML=rows.sort((a,b)=>b.date.localeCompare(a.date)||a.product.localeCompare(b.product,'es')||a.variety.localeCompare(b.variety,'es')||a.market.localeCompare(b.market)).map(x=>`<tr><td>${date(x.date)}</td><td>${escapeHTML(x.market_name)} (${escapeHTML(x.market)})</td><td>${escapeHTML(x.product)}</td><td>${escapeHTML(x.variety)}</td><td>${money(x.price_per_kg)}</td><td><a href="${escapeHTML(x.source_url)}#page=${x.source_page}" target="_blank" rel="noopener noreferrer">Boletín ${date(x.source_date)} · p. ${x.source_page} ↗</a></td></tr>`).join('')||`<tr><td colspan="6">${escapeHTML(virtual?'La variedad sigue en el catálogo; no hay precio atribuible porque la publicación no confirma ese atributo.':emptyMessage)}</td></tr>`;
  const wanted=marketData.catalog.filter(x=>['mandarina-sin-pepa','uva-verde-sin-pepa','manzana-verde-chilena'].includes(x.id));
  $('requested-varieties').innerHTML='<ul>'+wanted.map(x=>`<li><strong>${escapeHTML(x.name)}:</strong> ${escapeHTML(x.coverage_note)}</li>`).join('')+`<li><strong>Mandarina:</strong> la fuente distingue Malvacea, Satsuma (Costa) y Tangerina, pero no indica si son sin pepa.</li><li><strong>Uva:</strong> aparece “Uva Rosada Sin Pepa”; la etiqueta no dice verde. “Uva Thompson” tampoco confirma el atributo sin pepa.</li><li><strong>Manzana:</strong> “Manzana Importada (Chilena)” está confirmada; la fuente no declara color verde.</li><li><strong>Piña y palta:</strong> figuran “Piña Golden” y “Palta Fuerte Costa”.</li><li><strong>Plátanos:</strong> las publicaciones separan Isla, Bizcocho, Manzano y Seda (Selva/Congo); se conserva la denominación literal.</li><li><strong>Fresa:</strong> el PDF detallado identifica Sabrina y San Andreas cuando aparecen.</li></ul>`;
}
const retailCategoryNames={fruta:'Frutas',verdura:'Verduras y hortalizas',tuberculo:'Tubérculos',raiz_condimento:'Raíces y condimentos'};
function retailFilters(){
  if(!retailData)return;
  const keep={category:$('retail-category').value,product:$('retail-product').value,variety:$('retail-variety').value,retailer:$('retail-store').value,date:$('retail-date').value};
  const categories=[...new Set(retailData.observations.map(x=>x.category))].sort().map(x=>({value:x,label:retailCategoryNames[x]||x}));selectOptions($('retail-category'),categories,'Todas',keep.category);
  const category=$('retail-category').value,products=[...new Set(retailData.observations.filter(x=>!category||x.category===category).map(x=>x.product))].sort((a,b)=>a.localeCompare(b,'es'));selectOptions($('retail-product'),products.map(x=>({value:x,label:x})),'Todos',keep.product);
  const product=$('retail-product').value,scope=retailData.observations.filter(x=>(!category||x.category===category)&&(!product||x.product===product));
  const varieties=[...new Set(scope.map(x=>x.variety))].sort((a,b)=>a.localeCompare(b,'es'));selectOptions($('retail-variety'),varieties.map(x=>({value:x,label:x})),'Todas',keep.variety);
  const retailers=[...new Set(retailData.observations.map(x=>x.retailer))].sort((a,b)=>a.localeCompare(b,'es'));selectOptions($('retail-store'),retailers.map(x=>({value:x,label:x})),'Todos',keep.retailer);
  const dates=[...new Set(retailData.observations.map(x=>x.date))].sort().reverse();selectOptions($('retail-date'),dates.map(x=>({value:x,label:date(x)})),'Todas las fechas',keep.date||dates[0]||'');
}
function renderRetail(){
  if(!retailData){$('retail-summary').textContent='No se pudo cargar la instantánea de supermercados.';return;}
  retailFilters();
  const category=$('retail-category').value,product=$('retail-product').value,variety=$('retail-variety').value,retailer=$('retail-store').value,observedDate=$('retail-date').value;
  const rows=retailData.observations.filter(x=>(!category||x.category===category)&&(!product||x.product===product)&&(!variety||x.variety===variety)&&(!retailer||x.retailer===retailer)&&(!observedDate||x.date===observedDate));
  const comparables=rows.filter(x=>Number.isFinite(x.price_per_kg)).length,stores=[...new Set(retailData.observations.map(x=>x.retailer))].length;
  $('retail-summary').textContent=`${retailData.observations.length} precios observados · ${stores} supermercados · consulta ${timeLabel(retailData.captured_at)}`;
  $('retail-result-count').textContent=`${rows.length} filas · ${comparables} con precio comparable por kg`;
  $('retail-coverage-note').textContent=retailData.coverage.note;
  $('retail-observations').innerHTML=rows.sort((a,b)=>b.date.localeCompare(a.date)||a.product.localeCompare(b.product,'es')||a.retailer.localeCompare(b.retailer,'es')).map(x=>{
    const status=x.availability_status==='sin_stock_en_ficha'?'Sin stock en ficha':x.availability_status==='por_confirmar_distrito'?'Entrega por validar':'Disponibilidad no confirmada';
    const normalized=Number.isFinite(x.price_per_kg)?`${money(x.price_per_kg)} / kg${x.normalization_note?`<br><small>${escapeHTML(x.normalization_note)}</small>`:''}`:'No comparable por kg';
    return `<tr><td>${date(x.date)}</td><td><strong>${escapeHTML(x.retailer)}</strong><br><small>${escapeHTML(x.market_label)}</small></td><td>${escapeHTML(retailCategoryNames[x.category]||x.category)} · ${escapeHTML(x.product)}</td><td>${escapeHTML(x.variety)}<br><small>${escapeHTML(x.listing_name)}</small></td><td>${money(x.price_pen)} / ${escapeHTML(x.price_unit_label)}${x.price_note?`<br><small>${escapeHTML(x.price_note)}</small>`:''}</td><td>${normalized}</td><td><span class="pill">${status}</span><br><small>${escapeHTML(x.availability_note)}</small></td><td><a href="${escapeHTML(x.source_url)}" target="_blank" rel="noopener noreferrer">Ficha de ${escapeHTML(x.retailer)} ↗</a></td></tr>`;
  }).join('')||'<tr><td colspan="8">No hay precios minoristas para esos filtros en esta instantánea.</td></tr>';
}
async function optionalJSON(path){try{const r=await fetch(path,{cache:'no-store'});return r.ok?await r.json():null;}catch{return null;}}
async function start(){try{const r=await fetch('data.json',{cache:'no-store'});if(!r.ok)throw Error('HTTP '+r.status);data=F.validate(await r.json());[runStatus,schedule,marketData,retailData]=await Promise.all([optionalJSON('status.json'),optionalJSON('automation.json'),optionalJSON('market-data.json'),optionalJSON('retail-data.json')]);$('asof').value=today;$('asof').max=today;$('loading').hidden=true;$('app').hidden=false;renderSources();renderStatus();render();renderCalendar();if(marketData)renderMarket();else $('market-summary').textContent='No se pudo cargar el listado de productos y mercados.';renderRetail();showView();}
catch(e){$('loading').textContent='No se pudo cargar el dataset oficial. No se generan datos de reemplazo. Detalle: '+e.message;}}
$('fruit-cards').addEventListener('click',event=>{const b=event.target.closest('[data-fruit]');if(b){fruit=b.dataset.fruit;render();document.querySelector(`[data-fruit="${fruit}"]`).focus();}});
$('asof').addEventListener('change',render);$('period').addEventListener('change',render);$('kg').addEventListener('input',renderEstimate);$('region').addEventListener('change',renderCalendar);window.addEventListener('hashchange',showView);
$('market-category').addEventListener('change',()=>{ $('market-product').value='';$('market-variety').value='';renderMarket();});$('market-product').addEventListener('change',()=>{$('market-variety').value='';renderMarket();});$('market-variety').addEventListener('change',renderMarket);$('market-market').addEventListener('change',renderMarket);$('market-date').addEventListener('change',renderMarket);
$('retail-category').addEventListener('change',()=>{$('retail-product').value='';$('retail-variety').value='';renderRetail();});$('retail-product').addEventListener('change',()=>{$('retail-variety').value='';renderRetail();});$('retail-variety').addEventListener('change',renderRetail);$('retail-store').addEventListener('change',renderRetail);$('retail-date').addEventListener('change',renderRetail);
$('export').addEventListener('click',()=>{const blob=new Blob([JSON.stringify(F.report(data,fruit,$('asof').value),null,2)],{type:'application/json'}),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download=`frutaradar-029-${fruit}-${$('asof').value}.json`;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);});
start();
