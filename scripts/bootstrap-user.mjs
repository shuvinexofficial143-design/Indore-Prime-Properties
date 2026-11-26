import {db} from "../src/lib/db.mjs";import {hashPassword} from "../src/lib/password.mjs";
const email=(process.env.BOOTSTRAP_EMAIL||"").trim().toLowerCase(),password=process.env.BOOTSTRAP_PASSWORD||"",role=process.env.BOOTSTRAP_ROLE||"";
if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)||email.length>254||!["owner","agent","customer"].includes(role))throw new Error("Set valid bootstrap email and role");
const hash=await hashPassword(password);const pool=db();
try{const result=await pool.query("INSERT INTO users(organization_id,email,password_hash,role) SELECT id,$1,$2,$3 FROM organizations WHERE slug='indore-prime-demo' AND is_demo=true ON CONFLICT(email) DO NOTHING RETURNING id",[email,hash,role]);if(!result.rowCount)throw new Error("User already exists or demo organization missing");console.log("Authorized demo user created; remove bootstrap credentials from environment.");}finally{await pool.end();}
