const fs=require('fs'),assert=require('assert'),path=require('path');
const root=path.join(__dirname,'..');
const model=require(path.join(root,'dist/rarity-model.js'));
const records=JSON.parse(fs.readFileSync(path.join(root,'dist/data.json'))).records;
const eligible=records.slice(1),m=model.create(records),facets=['props','values','colors'];
const same=(a,b,f)=>f==='props'?a[2]===b[2]:f==='values'?a[4].length===b[4].length&&a[4].every((p,i)=>p[0]===b[4][i][0]&&p[2]===b[4][i][2]&&p[3]===b[4][i][3]):a[4].length===b[4].length&&a[4].every((p,i)=>p[1]===b[4][i][1]);
let checks=0;
for(const id of [1,52,8332,19656,19686,21565,26779,27904,29883,30287,31118]){
 for(let mask=1;mask<8;mask++){const selected=facets.filter((_,i)=>mask&(1<<i));const expected=eligible.filter(r=>selected.every(f=>same(r,records[id],f))).length;assert.strictEqual(m.count(id,selected),expected);checks++;}
 for(const f of facets){const expected=eligible.filter(r=>same(r,records[id],f)).length,d=f==='props'?31118:eligible.filter(r=>r[2]===records[id][2]).length;assert.strictEqual(m.metric(id,f).n,expected);assert.strictEqual(m.metric(id,f).d,d);checks++;}
}
for(const f of facets){const a=m.ranked(f);assert.strictEqual(a.length,31118);for(let i=1;i<a.length;i++){const cmp=m.count(a[i-1].row[0],['props'])-m.count(a[i].row[0],['props'])||a[i-1].n*a[i].d-a[i].n*a[i-1].d;assert(cmp<=0);assert(cmp===0?a[i].rank===a[i-1].rank:a[i].rank===i+1);}}
assert.strictEqual(m.count(0,['props']),null);assert.strictEqual(m.metric(0,'values'),null);
assert(eligible.every(r=>m.count(r[0],facets)===1));
console.log(`${checks} independently counted sample checks; full ranking/tie/zero/unique-combination checks passed.`);

const order=m.ranked('values').map(x=>x.row[2]);assert(order.lastIndexOf(3)<order.indexOf(5));
