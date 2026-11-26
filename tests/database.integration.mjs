import {test,after} from "node:test";import assert from "node:assert/strict";import {db} from "../src/lib/db.mjs";import {hashPassword} from "../src/lib/password.mjs";import {authenticate,sessionUser,revokeSession} from "../src/lib/auth-store.mjs";
if(!process.env.DATABASE_URL||process.env.TEST_DATABASE_ONLY!=="1")throw new Error("Run only against disposable test database");
const pool=db();after(()=>pool.end());
test("migrations, seed, tenant-scoped property reads and session lifecycle",async()=>{
 const org=(await pool.query("SELECT id FROM organizations WHERE slug='indore-prime-demo'")).rows[0].id;
 assert.equal((await pool.query("SELECT count(*)::int AS n FROM properties WHERE organization_id=$1",[org])).rows[0].n,26);
 const other=(await pool.query("INSERT INTO organizations(slug,name) VALUES('test-isolated','Isolated test') RETURNING id")).rows[0].id;
 assert.equal((await pool.query("SELECT count(*)::int AS n FROM properties WHERE organization_id=$1",[other])).rows[0].n,0);
 for(const role of ["owner","agent","customer"]){const email=role+"@example.invalid";await pool.query("INSERT INTO users(organization_id,email,password_hash,role) VALUES($1,$2,$3,$4)",[org,email,await hashPassword("disposable-test-password"),role]);assert.equal((await authenticate(email,"wrong-password")).status,"invalid");const login=await authenticate(email,"disposable-test-password");assert.equal(login.status,"ok");assert.equal((await sessionUser(login.token)).role,role);assert.equal((await sessionUser(login.token)).organization_id,org);await revokeSession(login.token);assert.equal(await sessionUser(login.token),null);}
 for(let i=0;i<8;i++)assert.equal((await authenticate("unknown@example.invalid","wrong-password")).status,"invalid");assert.equal((await authenticate("unknown@example.invalid","wrong-password")).status,"rate_limited");
});

import {publicSubmit,getLeads,getLead,updateLead,addFollowup,followups,finishFollowup,visits,updateVisit,receipt,notifications} from "../src/lib/crm-store.mjs";
test("demo enquiry deduplication, assignment, followup and visit conflict",async()=>{
 const org=(await pool.query("SELECT id FROM organizations WHERE slug='indore-prime-demo'")).rows[0].id;
 const get=async role=>({...((await pool.query("SELECT id,email,role,organization_id FROM users WHERE organization_id=$1 AND role=$2",[org,role])).rows[0]),organization_name:"Test"});
 const owner=await get("owner"),agent=await get("agent"),customer=await get("customer");
 const p={slug:"emerald-villa",name:"Integration Demo",phone:"0000000001",email:"demo@example.invalid",budget:20000000,location:"Nipania",bhk:4,purpose:"buy",message:"Fictional request",consent:"yes"};
 assert.equal((await publicSubmit(p)).status,"ok");assert.equal((await publicSubmit(p)).status,"ok");const l=(await getLeads(owner)).find(x=>x.phone===p.phone);assert.ok(l);assert.equal((await getLeads(owner)).filter(x=>x.phone===p.phone).length,1);assert.equal(await getLead(agent,l.id),null);assert.equal(await updateLead(owner,l.id,"assign",agent.id),true);assert.equal((await getLead(agent,l.id)).id,l.id);assert.equal(await updateLead(agent,l.id,"stage","qualified"),true);
 const date=new Date(Date.now()+2*86400000);date.setUTCMinutes(0,0,0);const time=new Date(date.getTime()+330*60000).toISOString().slice(0,16);assert.equal(await addFollowup(agent,l.id,time,"Call fictional customer",""),true);const f=(await followups(agent))[0];assert.ok(f);assert.equal(await finishFollowup(agent,f.id),true);
 const a=await publicSubmit(p,{time,visitors:2},customer);assert.equal(a.status,"ok");assert.equal((await receipt(a.token)).status,"requested");const b=await publicSubmit({...p,phone:"0000000002",name:"Other Demo"},{time,visitors:1},customer);assert.equal(b.status,"ok");
 const all=await visits(owner);const first=all.find(v=>v.customer_name==="Integration Demo"),second=all.find(v=>v.customer_name==="Other Demo");assert.equal(await updateVisit(owner,first.id,"confirmed",agent.id,""),"ok");assert.equal(await updateVisit(owner,second.id,"confirmed",agent.id,""),"conflict");assert.equal((await receipt(a.token)).status,"confirmed");assert.equal((await visits(customer)).length,2);assert.ok((await notifications(customer)).length>0);
});
