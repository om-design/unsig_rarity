'use strict';
(() => {
  const $ = id => document.getElementById(id);
  const facets=['props','values','colors'];
  let model;
  const percentage=(n,d)=>window.UnsigRarity.percent(n,d).toFixed(4)+'%';
  const selects = [...document.querySelectorAll('[data-select]')];
  let collection, eligible, current;
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

  function rarity(n,d=collection.population) { return percentage(d-n,d); }
  function indexCollection() { model=window.UnsigRarity.create(collection.records); }
  function matching(selected) { return model.count(current[0],selected); }

  function total() {
    for(const select of selects)select.closest('.facet-column').querySelector('.selection-state').textContent=select.checked?'Included in total':'Excluded from total';
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
    document.querySelector('.collection-note').hidden=zero;
    document.querySelector('.art-caption>span').textContent=zero?'THE SPECIAL ORIGIN':'PARAMETER-RENDERED PREVIEW';
    document.querySelector('.art-note').textContent=zero?'The algorithm-bearing origin is excluded from rarity calculations.':'A local reconstruction from the recorded properties. Preview differences do not affect rarity.';
    if(!zero) {
      $('props-value').textContent=current[2];
      $('values-value').textContent=current[2]+' ordered';
      $('colors-value').textContent=current[4].map(p=>p[1][0]).join(' → ');
      $('values-layers').replaceChildren(...current[4].map(p=>{const li=document.createElement('li');li.textContent=`${p[2]} · ${p[3]}° · ×${p[0]}`;return li;}));
      $('colors-layers').replaceChildren(...current[4].map(p=>{const li=document.createElement('li');li.textContent=p[1];return li;}));
      for(const facet of facets) {
        const m=model.metric(id,facet);
        $(facet+'-count').textContent=integer(m.n);
        $(facet+'-denominator').textContent=`of ${integer(m.d)} ${facet==='props'?'eligible unsigs':current[2]+'-property unsigs'}`;
        $(facet+'-basis').textContent=facet==='props'?'OVERALL RARITY':'WITHIN PROPERTY COUNT';
        $(facet+'-score').textContent=rarity(m.n,m.d);
        $(facet+'-share').textContent=percentage(m.n,m.d)+' share this';
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


  let page=0, rankingRows=[], walletIDs=null;
  const pageSize=30, policy='0e14267a8020229adc0184dd25fa3174c3f7d6caadcb4425c70e7c04';
  function renderRanking(){
    if(!model)return;
    const basis=$('ranking-basis').value, filter=Number($('ranking-props').value), scope=$('ranking-scope').value;
    rankingRows=model.ranked(basis,filter,scope==='wallet'?walletIDs:null);
    const pages=Math.max(1,Math.ceil(rankingRows.length/pageSize));page=Math.min(page,pages-1);
    const body=$('ranking-body');body.replaceChildren();
    for(const item of rankingRows.slice(page*pageSize,(page+1)*pageSize)){
      const tr=document.createElement('tr');
      for(const value of [item.rank,code(item.row[0]),item.row[2],`${integer(item.n)} / ${integer(item.d)}`,percentage(item.n,item.d),rarity(item.n,item.d)]){
        const td=document.createElement('td');
        if(tr.children.length===1){const button=document.createElement('button');button.type='button';button.textContent='#'+value;button.addEventListener('click',()=>{show(item.row[0]);$('lookup').scrollIntoView({behavior:'auto'});});td.append(button);}else td.textContent=String(value);
        tr.append(td);
      }body.append(tr);
    }
    $('ranking-caption').textContent=$('ranking-basis').selectedOptions[0].textContent+' — '+(scope==='wallet'?'loaded wallet':'collection');
    $('ranking-status').textContent=`${integer(rankingRows.length)} unsigs · smaller share is rarer · ties share a rank.`;
    $('ranking-page').textContent=`Page ${page+1} of ${pages}`;
    $('ranking-previous').disabled=page===0;$('ranking-next').disabled=page>=pages-1;
  }
  for(const id of ['ranking-basis','ranking-props','ranking-scope'])$(id).addEventListener('change',()=>{page=0;renderRanking();});
  $('ranking-previous').addEventListener('click',()=>{page--;renderRanking();});
  $('ranking-next').addEventListener('click',()=>{page++;renderRanking();});
  $('download-ranking').addEventListener('click',()=>{
    const rows=[['rank','unsig','props','matches','comparison_population','share_percent','rarity_percent','basis'],...rankingRows.map(r=>[r.rank,code(r.row[0]),r.row[2],r.n,r.d,window.UnsigRarity.percent(r.n,r.d).toFixed(4),window.UnsigRarity.percent(r.d-r.n,r.d).toFixed(4),$('ranking-basis').value])];
    const blob=new Blob([rows.map(r=>r.join(',')).join('\n')],{type:'text/csv;charset=utf-8'}),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download='unsig-rarity-'+$('ranking-basis').value+'.csv';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
  });
  function bech32(text){
    if(text!==text.toLowerCase())return false;
    const split=text.lastIndexOf('1');if(split<1||text.length-split<7)return false;
    const alphabet='qpzry9x8gf2tvdw0s3jn54khce6mua7l',hrp=text.slice(0,split),data=[...text.slice(split+1)].map(c=>alphabet.indexOf(c));if(data.includes(-1))return false;
    const values=[...[...hrp].map(c=>c.charCodeAt(0)>>5),0,...[...hrp].map(c=>c.charCodeAt(0)&31),...data],gen=[0x3b6a57b2,0x26508e6d,0x1ea119fa,0x3d4233dd,0x2a1462b3];
    let chk=1;for(const value of values){const top=chk>>>25;chk=((chk&0x1ffffff)<<5)^value;for(let i=0;i<5;i++)if((top>>>i)&1)chk^=gen[i];}return (chk>>>0)===1;
  }
  function walletSubject(value){
    let u;try{u=new URL(value.trim());}catch{throw Error('Enter a complete https://pool.pm/ wallet URL.');}
    if(u.protocol!=='https:'||u.hostname!=='pool.pm'||u.port||u.username||u.password||u.search||u.hash)throw Error('Use a plain https://pool.pm/ wallet link, without query parameters.');
    const parts=u.pathname.replace(/\/$/,'').split('/').slice(1),subject=parts[0];
    if(!/^(addr1|stake1)[0-9a-z]+$/.test(subject)||!bech32(subject))throw Error('This is not a valid Cardano mainnet address or stake-address link. Re-enter your wallet URL.');
    if(parts.length!==1&&(parts.length!==3||parts[1]!=='assets'||parts[2]!==policy))throw Error('Use a wallet URL, or its /assets/ link filtered to the unsigned_algorithms policy.');
    return subject;
  }
  $('wallet-form').addEventListener('submit',async event=>{
    event.preventDefault();let subject;
    try{subject=walletSubject($('wallet-url').value);}catch(e){$('wallet-url').setAttribute('aria-invalid','true');$('wallet-status').textContent=e.message+(walletIDs?' The previous completed wallet list remains displayed.':'');return;}
    $('wallet-url').removeAttribute('aria-invalid');$('wallet-button').disabled=true;$('wallet-status').textContent='Reading unsig holdings from pool.pm…';
    const ids=new Set(),seen=new Set();let cursor,more=true,requests=0,unknown=0,zero=false;
    try{
      while(more){
        if(++requests>100)throw Error('This wallet needs too many pages. Lookup stopped without displaying a partial list.');
        const url=new URL('https://pool.pm/api/assets/'+subject+'/'+policy);if(cursor!==undefined)url.searchParams.set('cursor',String(cursor));
        const response=await fetch(url,{signal:AbortSignal.timeout(20000)});if(!response.ok)throw Error('pool.pm lookup is unavailable ('+response.status+'). Please retry.');
        const data=await response.json();if(!Array.isArray(data.assets)||typeof data.has_more!=='boolean')throw Error('pool.pm returned an unexpected response. Please retry later.');
        for(const asset of data.assets){if(asset.policy!==policy)continue;const match=/^unsig(\d{5})$/.exec(asset.name||'');if(!match||Number(match[1])>31118){unknown++;continue;}const id=Number(match[1]);if(id===0)zero=true;else ids.add(id);}
        more=data.has_more;if(more){if(data.cursor==null||seen.has(String(data.cursor)))throw Error('The holdings list could not be completed. Please retry.');cursor=data.cursor;seen.add(String(cursor));}
      }
      walletIDs=ids;$('ranking-scope').querySelector('[value="wallet"]').disabled=false;$('ranking-scope').value='wallet';page=0;renderRanking();
      $('wallet-status').textContent=(ids.size?`${ids.size} eligible unsigs found. Their scores appear in the ranking above.`:'No unsigned_algorithms found in this address view.')+(zero?' #00000 is present but excluded from scoring.':'')+(unknown?` ${unknown} unrecognized assets were not scored.`:'')+' Holdings checked '+new Date().toLocaleString()+'.';
    }catch(e){$('wallet-status').textContent=(e.name==='TimeoutError'?'pool.pm took too long. Please retry.':e.message||'Lookup failed. Please retry.')+(walletIDs?' The previous completed wallet list remains displayed.':'');}
    finally{$('wallet-button').disabled=false;}
  });

  fetch('data.json').then(response=>{if(!response.ok)throw new Error('Collection unavailable');return response.json();}).then(data=>{
    if(data.population!==31118 || data.records.length!==31119 || data.records.some((r,i)=>r[0]!==i))throw new Error('Invalid collection data');
    collection=data;eligible=data.records.filter(row=>row[0]!==0);indexCollection();
    numberInput.disabled=false;$('search-button').disabled=false;$('random-button').disabled=false;$('wallet-button').disabled=false;$('download-ranking').disabled=false;renderRanking();$('wallet-status').textContent='Paste a pool.pm wallet URL to find its unsigs.';
    const requested=new URL(location.href).searchParams.get('unsig');
    const id=requested===null?52:parseID(requested);
    show(id===null?52:id,false);
    if(requested!==null && id===null)error('The linked unsig number is invalid. Showing #00052.');
  }).catch(()=>error('The collection could not load. Please refresh and try again.'));
})();
