import {NextResponse} from "next/server";
import {cookies} from "next/headers";
import {cookieName,validOrigin} from "@/lib/auth";
import {revokeSession} from "@/lib/auth-store.mjs";
export async function POST(req:Request){
 if(!validOrigin(req))return NextResponse.json({error:"Forbidden"},{status:403});
 const token=(await cookies()).get(cookieName)?.value;
 try{if(token)await revokeSession(token);}catch{return NextResponse.json({error:"Logout could not be completed. Retry."},{status:503});}
 const res=NextResponse.redirect(new URL("/login",req.url),303);
 res.cookies.set(cookieName,"",{httpOnly:true,secure:process.env.NODE_ENV==="production",sameSite:"lax",path:"/",maxAge:0});
 return res;
}
