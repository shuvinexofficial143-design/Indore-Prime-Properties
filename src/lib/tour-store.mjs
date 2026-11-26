import {db} from "./db.mjs";
import {uuid} from "./property-input.mjs";
export async function publicTour(id){
 if(!uuid.safeParse(id).success)return {scenes:[],hotspots:[]};
 const conn=db();
 const scenes=(await conn.query(`SELECT m.id,m.title,m.source_type,m.ai_generated FROM property_media m JOIN properties p ON p.id=m.property_id AND p.organization_id=m.organization_id JOIN organizations o ON o.id=p.organization_id WHERE p.id=$1 AND p.status='published' AND p.is_demo AND o.is_demo AND o.slug='indore-prime-demo' AND m.kind='panorama' AND m.visible AND m.approval_status='approved' ORDER BY m.sort_order,m.created_at,m.id`,[id])).rows.map(m=>({id:m.id,title:m.title+(m.ai_generated?" · AI preview":m.source_type!=="original"?" · Concept":""),url:"/api/media/"+m.id}));
 const ids=scenes.map(s=>s.id);if(!ids.length)return {scenes,hotspots:[]};
 const hotspots=(await conn.query("SELECT source_id AS source,target_id AS target,label,yaw::float8,pitch::float8 FROM panorama_hotspots WHERE property_id=$1 AND source_id=ANY($2::uuid[]) AND target_id=ANY($2::uuid[])",[id,ids])).rows;
 return {scenes,hotspots};
}
export async function ownerHotspots(org,id){return (await db().query("SELECT id,source_id,target_id,label,yaw::float8,pitch::float8 FROM panorama_hotspots WHERE organization_id=$1 AND property_id=$2 ORDER BY id",[org,id])).rows;}
export async function addHotspot(org,id,source,target,label,yaw,pitch){
 if(![id,source,target].every(v=>uuid.safeParse(v).success)||source===target||!label||label.length>80||!Number.isFinite(yaw)||!Number.isFinite(pitch)||Math.abs(yaw)>180||Math.abs(pitch)>85)return false;
 const conn=db();return (await conn.query(`INSERT INTO panorama_hotspots(organization_id,property_id,source_id,target_id,label,yaw,pitch) SELECT $1,$2,$3,$4,$5,$6,$7 WHERE (SELECT count(*) FROM property_media WHERE organization_id=$1 AND property_id=$2 AND id IN($3,$4) AND kind='panorama')=2 RETURNING id`,[org,id,source,target,label,yaw,pitch])).rowCount===1;
}
