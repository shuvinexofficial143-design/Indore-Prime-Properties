import {randomBytes,scrypt as scryptCallback,timingSafeEqual} from "node:crypto";
import {promisify} from "node:util";
const scrypt=promisify(scryptCallback);
const params={N:32768,r:8,p:1,maxmem:64*1024*1024};
/** @param {string} password */
export async function hashPassword(password){
 if(password.length<12||password.length>128)throw new Error("Password must be 12–128 characters");
 const salt=randomBytes(16).toString("hex");
 const derived=await scrypt(password,salt,64,params);
 return "scrypt-v1:"+salt+":"+Buffer.from(derived).toString("hex");
}
/** @param {string} password @param {string} encoded */
export async function verifyPassword(password,encoded){
 if(password.length>128)return false;
 const [version,salt,hash,extra]=encoded.split(":");
 if(version!=="scrypt-v1"||extra!==undefined||!(/^[a-f0-9]{32}$/).test(salt||"")||!(/^[a-f0-9]{128}$/).test(hash||""))return false;
 const derived=await scrypt(password,salt,64,params);
 return timingSafeEqual(Buffer.from(derived),Buffer.from(hash,"hex"));
}
