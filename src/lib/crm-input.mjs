import {z} from "zod";
import {locations} from "./catalog.mjs";
export const leadStages=["new","contacted","qualified","interested","visit_scheduled","visit_completed","negotiation","closed","lost"];
export const visitStages=["requested","confirmed","rescheduled","cancelled","completed","no_show"];
export const leadInput=z.object({slug:z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/).max(100),name:z.string().trim().min(2).max(100),phone:z.string().regex(/^000000[0-9]{4}$/),email:z.union([z.literal(""),z.string().email().max(254).refine(x=>x.toLowerCase().endsWith(".invalid"))]),budget:z.coerce.number().int().min(0).max(1000000000),location:z.enum(locations),bhk:z.coerce.number().int().min(0).max(30),purpose:z.enum(["buy","rent"]),message:z.string().trim().max(1000),consent:z.literal("yes"),utm_source:z.string().regex(/^[a-zA-Z0-9_.-]*$/).max(80).default(""),utm_medium:z.string().regex(/^[a-zA-Z0-9_.-]*$/).max(80).default(""),utm_campaign:z.string().regex(/^[a-zA-Z0-9_.-]*$/).max(80).default("")});
export function kolkataTime(value){
 if(typeof value!=="string"||!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(value))return null;
 const parsed=new Date(value+":00+05:30");if(!Number.isFinite(parsed.getTime()))return null;
 if(new Date(parsed.getTime()+330*60000).toISOString().slice(0,16)!==value)return null;
 return parsed;
}
export function visitTime(value,now=Date.now()){const d=kolkataTime(value);return d&&d.getTime()>=now+5*60000&&d.getTime()<=now+90*86400000&&[0,30].includes(Number(value.slice(-2)))?d:null;}
