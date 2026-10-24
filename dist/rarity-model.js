/* Ordered parameter rarity. No sorting, color clustering, or independence assumption. */
(function(root){
  'use strict';
  const facets=['props','values','colors'];
  const signatures=row=>({props:String(row[2]),values:JSON.stringify(row[4].map(p=>[p[2],p[3],p[0]])),colors:JSON.stringify(row[4].map(p=>p[1]))});
  const percent=(n,d)=>Math.floor((n*1000000+d/2)/d)/10000;
  function create(records){
    const rows=records.filter(r=>r[0]!==0), N=rows.length, keys=new Map(rows.map(r=>[r[0],signatures(r)])), indexes=new Map();
    for(let mask=1;mask<8;mask++){
      const selected=facets.filter((_,i)=>mask&(1<<i)), groups=new Map();
      for(const r of rows){const k=JSON.stringify(selected.map(f=>keys.get(r[0])[f]));groups.set(k,(groups.get(k)||0)+1);}
      indexes.set(selected.join(','),groups);
    }
    function count(id,selected){if(id===0)return null;const fs=facets.filter(f=>selected.includes(f));if(!fs.length)return N;return indexes.get(fs.join(',')).get(JSON.stringify(fs.map(f=>keys.get(id)[f])));}
    function metric(id,basis){if(id===0)return null;const n=count(id,[basis]),d=basis==='props'?N:count(id,['props']);return {n,d,share:percent(n,d),rarity:percent(d-n,d)};}
    function ranked(basis,filter=0,ids=null){
      const rankedRows=rows.filter(r=>(!filter||r[2]===filter)&&(!ids||ids.has(r[0]))).map(r=>({row:r,...metric(r[0],basis)}));
      // Property-count scarcity is an absolute priority, not a weighted score.
      const compare=(a,b)=>count(a.row[0],['props'])-count(b.row[0],['props'])||a.n*b.d-b.n*a.d;
      rankedRows.sort((a,b)=>compare(a,b)||a.row[0]-b.row[0]);
      let previous=null,rank=0;for(let i=0;i<rankedRows.length;i++){const r=rankedRows[i];if(!previous||compare(r,previous)!==0)rank=i+1;r.rank=rank;previous=r;}return rankedRows;
    }
    return {N,count,metric,ranked,signatures:keys};
  }
  const api={create,signatures,percent};
  if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.UnsigRarity=api;
})(globalThis);
