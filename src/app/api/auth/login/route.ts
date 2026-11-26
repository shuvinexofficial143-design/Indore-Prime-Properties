import {NextResponse} from "next/server";
import {authenticate,SESSION_SECONDS} from "@/lib/auth-store.mjs";
import {databaseConfigured} from "@/lib/db.mjs";
import {cookieName,roleHome,validOrigin,type Role} from "@/lib/auth";
export const runtime="nodejs";
export async function POST(req:Request){
 if(!validOrigin(req))return NextResponse.json({error:"Forbidden"},{status:403});
 if(!databaseConfigured())return NextResponse.json({error:"Login is not configured"},{status:503});
 try{
 if(Number(req.headers.get("content-length")||0)>4096)return NextResponse.json({error:"Request too large"},{status:413});
 const raw=await req.text();if(raw.length>4096)return NextResponse.json({error:"Request too large"},{status:413});
 const body=new URLSearchParams(raw);
 const result=await authenticate(body.get("email")||"",body.get("password")||"");
 if(result.status!=="ok"||!result.token){const url=new URL("/login",req.url);url.searchParams.set("error",result.status==="rate_limited"?"rate":"invalid");return NextResponse.redirect(url,303);}
 const res=NextResponse.redirect(new URL(roleHome(result.role as Role),req.url),303);
 res.cookies.set(cookieName,result.token,{httpOnly:true,secure:process.env.NODE_ENV==="production",sameSite:"lax",path:"/",maxAge:SESSION_SECONDS});
 return res;
 }catch{return NextResponse.json({error:"Login temporarily unavailable"},{status:503});}
}
