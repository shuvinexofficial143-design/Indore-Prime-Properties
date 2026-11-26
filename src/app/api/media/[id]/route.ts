import {NextResponse} from "next/server";import {db,databaseConfigured} from "@/lib/db.mjs";import {currentUser} from "@/lib/auth";import {uuid} from "@/lib/property-input.mjs";import {storageConfigured,readObject} from "@/lib/storage";
export const runtime="nodejs";
export async function GET(_req:Request,{params}:{params:Promise<{id:string}>}){
 const {id}=await params;if(!uuid.safeParse(id).success||!databaseConfigured()||!storageConfigured())return new Response(null,{status:404});
 const u=await currentUser();const row=(await db().query(`SELECT m.*,p.status,p.is_demo,o.slug,o.is_demo AS org_demo FROM property_media m JOIN properties p ON p.id=m.property_id AND p.organization_id=m.organization_id JOIN organizations o ON o.id=m.organization_id WHERE m.id=$1`,[id])).rows[0];
 if(!row||!((row.visible&&row.approval_status==="approved"&&row.status==="published"&&row.is_demo&&row.org_demo&&row.slug==="indore-prime-demo")||(u?.role==="owner"&&u.organization_id===row.organization_id)))return new Response(null,{status:404});
 try{const bytes=await readObject(row.storage_key);return new NextResponse(Buffer.from(bytes),{headers:{"Content-Type":row.mime,"Cache-Control":"private, no-store","X-Content-Type-Options":"nosniff","Content-Disposition":row.mime==="application/pdf"?'attachment; filename="property-document.pdf"':"inline"}});}catch{return new Response(null,{status:503});}
}
