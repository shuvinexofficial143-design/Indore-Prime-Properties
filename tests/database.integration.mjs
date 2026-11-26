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
