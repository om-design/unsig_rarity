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
    // Compare separate frequencies in priority order. Never count full configurations.
    const overallCompare=(a,b)=>count(a[0],['props'])-count(b[0],['props'])||
      count(a[0],['values'])-count(b[0],['values'])||count(a[0],['colors'])-count(b[0],['colors']);
    const ordered=[...rows].sort((a,b)=>overallCompare(a,b)||a[0]-b[0]);
    const allScores=new Map([[0,{row:records.find(r=>r[0]===0),globalRank:1,score:100}]]);
    let previous=null,globalRank=1;
    ordered.forEach((row,i)=>{if(!previous||overallCompare(row,previous)!==0)globalRank=i+2;allScores.set(row[0],{row,globalRank,score:percent(N+1-globalRank,N)});previous=row;});
    function overallRanked(filter=0,ids=null){
      const result=[...allScores.values()].filter(x=>x.row&&(filter===-1?x.row[0]===0:(!filter||x.row[2]===filter))&&(!ids||ids.has(x.row[0])));
      let prior=null,rank=0;return result.map((x,i)=>{if(prior!==x.globalRank)rank=i+1;prior=x.globalRank;return {...x,rank};});
    }
    return {N,count,metric,ranked,signatures:keys,overall:id=>allScores.get(id),overallRanked};
  }
  const api={create,signatures,percent};
  if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.UnsigRarity=api;
})(globalThis);
