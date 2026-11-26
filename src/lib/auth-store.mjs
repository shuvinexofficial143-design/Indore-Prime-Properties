import {createHash,randomBytes} from "node:crypto";
import {db} from "./db.mjs";
import {verifyPassword} from "./password.mjs";
export const SESSION_SECONDS=60*60*24*7;
const digest=(/** @type {string} */ token)=>createHash("sha256").update(token).digest("hex");
const dummy="scrypt-v1:"+"0".repeat(32)+":"+"0".repeat(128);
/** @param {string} email @param {string} password */
export async function authenticate(email,password){
 const key=email.trim().toLowerCase();
 if(key.length>254||!key.includes("@")||password.length>128)return {status:"invalid"};
 const conn=db();
 const rate=await conn.query(`INSERT INTO login_attempts(email_hash,attempts,window_start) VALUES($1,1,now())
 ON CONFLICT(email_hash) DO UPDATE SET attempts=CASE WHEN login_attempts.window_start<now()-interval '15 minutes' THEN 1 ELSE LEAST(login_attempts.attempts+1,1000000) END,
 window_start=CASE WHEN login_attempts.window_start<now()-interval '15 minutes' THEN now() ELSE login_attempts.window_start END RETURNING attempts`,[digest(key)]);
 if(rate.rows[0].attempts>8)return {status:"rate_limited"};
 const result=await conn.query("SELECT id,password_hash,role FROM users WHERE email=$1 AND active=true",[key]);
 const user=result.rows[0];
 const valid=await verifyPassword(password,user?.password_hash??dummy);
 if(!user||!valid)return {status:"invalid"};
 const token=randomBytes(32).toString("hex");
 const client=await conn.connect();try{await client.query("BEGIN");const fresh=(await client.query("SELECT id,role,password_hash FROM users WHERE id=$1 AND active=true FOR UPDATE",[user.id])).rows[0];if(!fresh||fresh.password_hash!==user.password_hash){await client.query("ROLLBACK");return {status:"invalid"};}await client.query("INSERT INTO sessions(token_hash,user_id,expires_at) VALUES($1,$2,now()+($3::int*interval '1 second'))",[digest(token),user.id,SESSION_SECONDS]);await client.query("DELETE FROM login_attempts WHERE email_hash=$1",[digest(key)]);await client.query("COMMIT");return {status:"ok",token,role:fresh.role};}catch(e){await client.query("ROLLBACK");throw e;}finally{client.release();}
}
/** @param {string} token */
export async function sessionUser(token){
 if(!/^[a-f0-9]{64}$/.test(token))return null;
 const res=await db().query(`SELECT u.id,u.email,u.role,u.organization_id,o.name AS organization_name
 FROM sessions s JOIN users u ON u.id=s.user_id JOIN organizations o ON o.id=u.organization_id
 WHERE s.token_hash=$1 AND s.expires_at>now() AND u.active=true`,[digest(token)]);
 return res.rows[0]??null;
}
/** @param {string} token */
export async function revokeSession(token){if(/^[a-f0-9]{64}$/.test(token))await db().query("DELETE FROM sessions WHERE token_hash=$1",[digest(token)]);}
