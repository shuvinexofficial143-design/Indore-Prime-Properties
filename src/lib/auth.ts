import "server-only";
import {cookies} from "next/headers";
import {redirect} from "next/navigation";
import {sessionUser} from "./auth-store.mjs";
import {databaseConfigured} from "./db.mjs";
export type Role="owner"|"agent"|"customer";
export type SessionUser={id:string;email:string;role:Role;organization_id:string;organization_name:string};
export const cookieName=process.env.NODE_ENV==="production"?"__Host-indore_session":"indore_session";
export function roleHome(role:Role){return role==="owner"?"/admin":role==="agent"?"/agent":"/app";}
export async function currentUser():Promise<SessionUser|null>{
 if(!databaseConfigured())return null;
 const token=(await cookies()).get(cookieName)?.value;
 if(!token)return null;
 try{return await sessionUser(token) as SessionUser|null;}catch{return null;}
}
export async function requireRole(role:Role):Promise<SessionUser>{
 const user=await currentUser();
 if(!user)redirect("/login");
 if(user.role!==role)redirect(roleHome(user.role));
 return user;
}
export function validOrigin(req:Request){
 try{
 const expected=new URL(process.env.APP_ORIGIN||req.url).origin;
 return req.headers.get("origin")===expected;
 }catch{return false;}
}
