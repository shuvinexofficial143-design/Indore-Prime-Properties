import {NextResponse} from "next/server";import {randomUUID} from "node:crypto";import {currentUser,validOrigin} from "@/lib/auth";import {ownerProperty} from "@/lib/property-store.mjs";import {checkMedia,MAX_MEDIA} from "@/lib/media-validation.mjs";import {db} from "@/lib/db.mjs";import {storageConfigured,storeObject,deleteObject} from "@/lib/storage";
export const runtime="nodejs";
export async function POST(req:Request){
 const u=await currentUser();if(!u||u.role!=="owner"||!validOrigin(req))return NextResponse.json({error:"Forbidden"},{status:403});
 if(!storageConfigured())return NextResponse.json({error:"Object storage is not configured"},{status:503});
 const len=Number(req.headers.get("content-length"));if(!Number.isFinite(len)||len<=0||len>MAX_MEDIA+65536)return NextResponse.json({error:"Maximum file size: 3 MB"},{status:413});
 let key:string|undefined;let uploaded=false;
 try{
 const f=await req.formData(),pid=String(f.get("property")||""),kind=String(f.get("kind")||""),title=String(f.get("title")||"").trim(),file=f.get("file");
 if(!(file instanceof File)||file.size>MAX_MEDIA||!title||title.length>120||!(await ownerProperty(u.organization_id,pid)))return NextResponse.json({error:"Invalid media or property"},{status:400});
 const room=String(f.get("room")||"").trim(),caption=String(f.get("caption")||"").trim();if(room.length>80||caption.length>500)return NextResponse.json({error:"Invalid media metadata"},{status:400});
 const bytes=new Uint8Array(await file.arrayBuffer());const mime=checkMedia(kind,bytes);key=u.organization_id+"/"+pid+"/"+randomUUID();
 const c=await db().connect();try{await c.query("BEGIN");await c.query("SELECT pg_advisory_xact_lock(hashtext($1))",[u.organization_id]);const q=(await c.query("SELECT count(*) FILTER(WHERE property_id=$2)::int AS n,COALESCE(sum(bytes),0)::bigint AS used FROM property_media WHERE organization_id=$1",[u.organization_id,pid])).rows[0];if(q.n>=100||Number(q.used)+bytes.length>1024*1024*1024){await c.query("ROLLBACK");return NextResponse.json({error:"Media quota reached"},{status:413});}await storeObject(key,bytes,mime);uploaded=true;await c.query("INSERT INTO property_media(organization_id,property_id,kind,mime,storage_key,bytes,title,room_label,caption) VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9)",[u.organization_id,pid,kind,mime,key,bytes.length,title,room,caption]);await c.query("COMMIT");}catch(e){await c.query("ROLLBACK");throw e;}finally{c.release();}
 if(req.headers.get("accept")?.includes("application/json"))return NextResponse.json({ok:true},{status:201});
 return NextResponse.redirect(new URL("/admin/properties/"+pid,req.url),303);
 }catch{if(uploaded&&key)try{await deleteObject(key);}catch{}return NextResponse.json({error:"Upload failed; check supported format and storage configuration"},{status:400});}
}
