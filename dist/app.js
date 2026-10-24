'use strict';
(() => {
  const $ = id => document.getElementById(id);
  const facetIndex = {geometry:1, properties:2, color:3};
  const facetNames = {geometry:'geometry', properties:'property count', color:'color cluster'};
  const selects = [...document.querySelectorAll('[data-select]')];
  let collection, eligible, current;
  const counts = new Map();
  const integer = n => n.toLocaleString('en-US');
  const code = n => String(n).padStart(5,'0');
  const numberInput = $('unsig-number');
  let acceptedInput = numberInput.value;
  const editableID = value => /^\d{0,5}$/.test(value) && (value === '' || Number(value) <= 31118);
  function rejectInput() {
    $('search-message').classList.add('error');
    $('search-message').textContent='Use digits only, from 00000 to 31118. Your entry was kept.';
  }
  numberInput.addEventListener('beforeinput', event => {
    if(event.data == null || event.inputType.startsWith('delete')) return;
    const next = numberInput.value.slice(0,numberInput.selectionStart) + event.data + numberInput.value.slice(numberInput.selectionEnd);
    if(!editableID(next)) { event.preventDefault(); rejectInput(); }
  });
  numberInput.addEventListener('paste', event => {
    const text = event.clipboardData.getData('text');
    const next = numberInput.value.slice(0,numberInput.selectionStart) + text + numberInput.value.slice(numberInput.selectionEnd);
    if(!editableID(next)) { event.preventDefault(); rejectInput(); }
  });
  numberInput.addEventListener('input', () => {
    if(!editableID(numberInput.value)) {
      numberInput.value=acceptedInput;
      rejectInput();
      return;
    }
    acceptedInput=numberInput.value;
    numberInput.removeAttribute('aria-invalid');
    $('search-message').classList.remove('error');
    $('search-message').textContent=current ? `Showing unsig #${code(current[0])}. Search to apply your entry.` : 'Enter an unsig number.';
  });

  function rarity(n) {
    // Integer arithmetic rounds 100*(1-n/N) to four decimal places.
    const units = Math.floor(((collection.population - n) * 1000000 + collection.population / 2) / collection.population);
    return (units / 10000).toFixed(4) + '%';
  }
  function key(row, facets) { return facets.map(f=>row[facetIndex[f]]).join('|'); }
  function indexCollection() {
    const facets = Object.keys(facetIndex);
    for(let mask=1;mask<8;mask++) {
      const selected=facets.filter((_,i)=>mask&(1<<i));
      const group=new Map();
      for(const row of eligible) { const k=key(row,selected); group.set(k,(group.get(k)||0)+1); }
      counts.set(selected.join(','),group);
    }
  }
  function matching(facets) { return counts.get(facets.join(',')).get(key(current,facets)); }

  function total() {
    if(!current || current[0]===0) return;
    const chosen=selects.filter(el=>el.checked).map(el=>el.dataset.select);
    $('selection-summary').textContent=`${chosen.length} FACET${chosen.length===1?'':'S'} SELECTED`;
    $('total-block').classList.toggle('empty',!chosen.length);
    if(!chosen.length) {
      $('total-score').textContent='Select a rarity facet';
      $('total-count').textContent='Check a column above to define your combination.';
      $('total-explanation').hidden=true;
      $('total-block').removeAttribute('data-matches');
      return;
    }
    const n=matching(chosen);
    $('total-score').textContent=rarity(n);
    $('total-count').textContent=`${integer(n)} of ${integer(collection.population)} unsigs share the selected combination.`;
    $('total-explanation').hidden=false;
    $('total-block').dataset.matches=String(n);
  }

  function renderPreview(row) {
    const canvas=$('artwork'), ctx=canvas.getContext('2d');
    const dim=canvas.width, range=4294967293, modulus=4294967296;
    const image=ctx.createImageData(dim,dim);
    if(row[0]===0) { canvas.setAttribute('aria-label','unsig #00000: the special zero-property origin, excluded from rarity');ctx.fillStyle='#01060d';ctx.fillRect(0,0,dim,dim);return; }
    const mean=(dim-1)/2,std=dim/6;
    const normal=new Float64Array(dim),cdf=new Float64Array(dim);let sum=0;
    for(let x=0;x<dim;x++) { normal[x]=Math.trunc(Math.PI*std*Math.exp(-0.5*((x-mean)/std)**2));sum+=normal[x];cdf[x]=sum; }
    function scale(values) { let min=Infinity,max=-Infinity;for(const v of values){min=Math.min(min,v);max=Math.max(max,v);}return Float64Array.from(values,v=>(v-min)/(max-min)*range); }
    const distributions={Normal:scale(normal),CDF:scale(cdf)};
    const channels={Red:0,Green:1,Blue:2};
    const props=row[4].map(([mult,color,dist,rotation])=>({mult,channel:channels[color],values:distributions[dist],rotation}));
    for(let y=0;y<dim;y++)for(let x=0;x<dim;x++) {
      const values=[0,0,0];
      for(const p of props) {
        const i=p.rotation===0?x:p.rotation===90?dim-1-y:p.rotation===180?dim-1-x:y;
        values[p.channel]=Math.floor(values[p.channel]+p.mult*p.values[i])%modulus;
      }
      const offset=(y*dim+x)*4;
      for(let c=0;c<3;c++)image.data[offset+c]=Math.min(255,Math.floor(values[c]/range*255));
      image.data[offset+3]=255;
    }
    ctx.putImageData(image,0,0);
    canvas.setAttribute('aria-label',`Parameter-rendered preview of unsig #${code(row[0])}`);
  }

  function show(id, updateURL=true) {
    current=collection.records[id];
    $('result').hidden=false;
    $('result-id').textContent='#'+code(id);
    $('unsig-number').value=code(id);
    acceptedInput=numberInput.value;
    $('original-link').href='https://www.unsigs.com/nft/'+code(id);
    $('object-geometry').textContent=current[1];
    const zero=id===0;
    $('facet-grid').hidden=zero;
    document.querySelector('.facet-intro').hidden=zero;
    $('total-block').hidden=zero;
    $('genesis-panel').hidden=!zero;
    $('genesis-art-label').hidden=!zero;
    $('provenance-note').hidden=true;
    if(!zero) {
      $('geometry-value').textContent=current[1];
      $('properties-value').textContent=current[2];
      $('properties-value').nextElementSibling.textContent=current[2]===1?'PROPERTY':'PROPERTIES';
      $('color-value').textContent=current[3];
      for(const facet of Object.keys(facetIndex)) {
        const n=matching([facet]);
        $(facet+'-count').textContent=integer(n);
        $(facet+'-score').textContent=rarity(n);
      }
      if(current[1]!==current[5]) {
        $('provenance-note').textContent=`Reviewed project assignment: ${current[1]}. Published reference: ${current[5]}. See the method for review details.`;
        $('provenance-note').hidden=false;
      }
      total();
    }
    renderPreview(current);
    $('search-message').classList.remove('error');
    $('unsig-number').removeAttribute('aria-invalid');
    $('search-message').textContent=zero?'#00000 is excluded from rarity calculations.':`Showing unsig #${code(id)}.`;
    document.title=`unsig #${code(id)} — Rarity Observatory`;
    if(updateURL) { const url=new URL(location.href);url.searchParams.set('unsig',code(id));history.replaceState(null,'',url); }
  }

  function parseID(value) {
    const clean=value;
    if(!/^\d{1,5}$/.test(clean))return null;
    const n=Number(clean);return Number.isInteger(n)&&n>=0&&n<collection.records.length?n:null;
  }
  function error(message) { $('unsig-number').setAttribute('aria-invalid','true');$('search-message').classList.add('error');$('search-message').textContent=message; }
  $('lookup').addEventListener('submit', event=>{
    event.preventDefault();if(!collection)return;
    const value=$('unsig-number').value;
    if(!value.trim()){error('Enter an unsig number to search.');return;}
    const id=parseID(value);
    if(id===null){error('Use a whole unsig number from 00000 to 31118.');return;}
    show(id);
  });
  $('random-button').addEventListener('click',()=>show(1+Math.floor(Math.random()*collection.population)));
  for(const select of selects)select.addEventListener('change',total);
  window.addEventListener('popstate',()=>{if(collection){const n=parseID(new URL(location.href).searchParams.get('unsig')||'52');if(n!==null)show(n,false);}});

  fetch('data.json').then(response=>{if(!response.ok)throw new Error('Collection unavailable');return response.json();}).then(data=>{
    if(data.population!==31118 || data.records.length!==31119 || data.records.some((r,i)=>r[0]!==i))throw new Error('Invalid collection data');
    collection=data;eligible=data.records.filter(row=>row[0]!==0);indexCollection();
    $('search-button').disabled=false;$('random-button').disabled=false;
    const requested=new URL(location.href).searchParams.get('unsig');
    const id=requested===null?52:parseID(requested);
    show(id===null?52:id,false);
    if(requested!==null && id===null)error('The linked unsig number is invalid. Showing #00052.');
  }).catch(()=>error('The collection could not load. Please refresh and try again.'));
})();
