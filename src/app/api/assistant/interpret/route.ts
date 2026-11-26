import {NextResponse} from "next/server";
import {currentUser,validOrigin} from "@/lib/auth";
import {getPool} from "@/lib/db.mjs";
import {assistantProviderConfigured,providerInput,interpretWithProvider} from "@/lib/assistant-provider.mjs";
const reply=(data:object,status=200)=>NextResponse.json(data,{status,headers:{"Cache-Control":"private, no-store"}});
export async function POST(req:Request){
 if(!validOrigin(req))return reply({error:"Origin rejected"},403);
 const u=await currentUser();if(!u)return reply({error:"Sign in required"},401);
 if(!assistantProviderConfigured())return reply({error:"External assistant disabled"},503);
 let body;try{const raw=await req.text();if(raw.length>4096)return reply({error:"Request too large"},413);body=JSON.parse(raw);}catch{return reply({error:"Invalid request"},400);}
 if(!body||body.consent!==true||!providerInput(body.message))return reply({error:"Consent and a property-only query are required"},400);
 try{const c=await getPool().connect();try{await c.query("BEGIN");await c.query("SELECT pg_advisory_xact_lock(hashtext($1))",[u.organization_id]);const {rows:[usage]}=await c.query("SELECT COALESCE(sum(attempts),0)::int AS total, COALESCE(sum(attempts) FILTER (WHERE user_id=$2),0)::int AS personal FROM assistant_provider_daily WHERE organization_id=$1 AND day=(now() AT TIME ZONE 'UTC')::date",[u.organization_id,u.id]);if(usage.total>=50||usage.personal>=10){await c.query("ROLLBACK");return reply({error:"Daily limit reached"},429);}await c.query("INSERT INTO assistant_provider_daily(organization_id,user_id,day,attempts) VALUES($1,$2,(now() AT TIME ZONE 'UTC')::date,1) ON CONFLICT(organization_id,user_id,day) DO UPDATE SET attempts=assistant_provider_daily.attempts+1",[u.organization_id,u.id]);await c.query("COMMIT");}catch(e){await c.query("ROLLBACK");throw e;}finally{c.release();}
 const filters=await interpretWithProvider({message:body.message,previous:body.previous,apiKey:process.env.OPENAI_API_KEY!,model:process.env.OPENAI_PROPERTY_ASSISTANT_MODEL!});return reply({filters});
 }catch{return reply({error:"External parser unavailable"},503);}
}
