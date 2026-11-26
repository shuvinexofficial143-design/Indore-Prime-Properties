"use server";
import {requireRole} from "@/lib/auth";
import {saveProperty,ownerStatus} from "@/lib/property-store.mjs";
import {db} from "@/lib/db.mjs";
import {uuid} from "@/lib/property-input.mjs";
import {revalidatePath} from "next/cache";
import {redirect} from "next/navigation";
export async function save(form:FormData){
 const u=await requireRole("owner"),id=String(form.get("id")||"");
 if(id&&!uuid.safeParse(id).success)redirect("/admin/properties?error=invalid");
 const input=Object.fromEntries(["title","slug","location","type","purpose","price","beds","baths","area","description","status","art"].map(k=>[k,form.get(k)]));
 let result:string|null=null;
 try{result=await saveProperty(u.organization_id,id||null,input);}catch{redirect((id?"/admin/properties/"+id:"/admin/properties/new")+"?error=invalid");}
 if(!result)redirect("/admin/properties?error=missing");
 revalidatePath("/");revalidatePath("/properties");revalidatePath("/admin/properties");
 redirect("/admin/properties/"+result+"?saved=1");
}
export async function changeStatus(form:FormData){
 const u=await requireRole("owner");const id=String(form.get("id")||"");let ok=false;
 try{ok=await ownerStatus(u.organization_id,id,String(form.get("status")||""));}catch{}
 revalidatePath("/");revalidatePath("/properties");revalidatePath("/admin/properties");redirect("/admin/properties"+(ok?"":"?error=invalid"));
}
export async function mediaVisibility(form:FormData){
 const u=await requireRole("owner");const id=String(form.get("id")||""),pid=String(form.get("property")||"");if(!uuid.safeParse(id).success||!uuid.safeParse(pid).success)redirect("/admin/properties");
 await db().query("UPDATE property_media SET visible=$4 WHERE organization_id=$1 AND property_id=$2 AND id=$3 AND archived_at IS NULL AND generation_job_id IS NULL AND (NOT $4 OR approval_status='approved')",[u.organization_id,pid,id,form.get("visible")==="true"]);
 revalidatePath("/");revalidatePath("/properties");redirect("/admin/properties/"+pid);
}

export async function editMedia(f:FormData){const u=await requireRole("owner"),pid=String(f.get("property")||""),id=String(f.get("id")||""),title=String(f.get("title")||"").trim(),order=Number(f.get("order")),room=String(f.get("room")||"").trim(),caption=String(f.get("caption")||"").trim();if(![pid,id].every(v=>uuid.safeParse(v).success))redirect("/admin/properties");if(!title||title.length>120||room.length>80||caption.length>500||!Number.isInteger(order)||order<0||order>10000)redirect("/admin/properties/"+pid+"?error=media");await db().query("UPDATE property_media SET title=$4,sort_order=$5,room_label=$6,caption=$7 WHERE organization_id=$1 AND property_id=$2 AND id=$3",[u.organization_id,pid,id,title,order,room,caption]);revalidatePath("/");redirect("/admin/properties/"+pid);}
export async function archiveMedia(f:FormData){const u=await requireRole("owner"),pid=String(f.get("property")||""),id=String(f.get("id")||""),restore=f.get("restore")==="yes";if(![pid,id].every(v=>uuid.safeParse(v).success))redirect("/admin/properties");const result=await db().query("UPDATE property_media SET visible=false,is_cover=false,archived_at=CASE WHEN $4::boolean THEN NULL ELSE now() END WHERE organization_id=$1 AND property_id=$2 AND id=$3 AND generation_job_id IS NULL",[u.organization_id,pid,id,restore]);revalidatePath("/");revalidatePath("/properties");redirect("/admin/properties/"+pid+(result.rowCount?"":"?error=media"));}

export async function setCover(f:FormData){const u=await requireRole("owner"),pid=String(f.get("property")||""),id=String(f.get("id")||"");if(![pid,id].every(v=>uuid.safeParse(v).success))redirect("/admin/properties");const c=await db().connect();try{await c.query("BEGIN");await c.query("SELECT pg_advisory_xact_lock(hashtext($1))",[u.organization_id]);const row=(await c.query("SELECT id FROM property_media WHERE organization_id=$1 AND property_id=$2 AND id=$3 AND kind='photo' AND visible AND archived_at IS NULL AND approval_status='approved'",[u.organization_id,pid,id])).rows[0];if(!row)throw Error("Not eligible");await c.query("UPDATE property_media SET is_cover=false WHERE organization_id=$1 AND property_id=$2",[u.organization_id,pid]);await c.query("UPDATE property_media SET is_cover=true WHERE organization_id=$1 AND property_id=$2 AND id=$3",[u.organization_id,pid,id]);await c.query("COMMIT");}catch{await c.query("ROLLBACK");}finally{c.release();}revalidatePath("/");revalidatePath("/properties");redirect("/admin/properties/"+pid);}
