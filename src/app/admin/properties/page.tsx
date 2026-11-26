import Link from "next/link";
import {requireRole} from "@/lib/auth";
import {ownerProperties} from "@/lib/property-store.mjs";
import {Dashboard} from "@/components/dashboard";
import {formatPrice} from "@/lib/catalog.mjs";
import {changeStatus} from "./actions";
import type {Property} from "@/lib/property-types";
export const dynamic="force-dynamic";
export default async function Page({searchParams}:{searchParams:Promise<{error?:string}>}){
 const u=await requireRole("owner");const rows:Property[]=await ownerProperties(u.organization_id);const {error}=await searchParams;
 return <Dashboard user={u} title="Manage properties"><div className="toolbar"><Link className="button" href="/admin/properties/new">Add property</Link><Link className="button outline" href="/admin/properties/import">CSV import / export</Link><Link className="button outline" href="/admin">Overview</Link></div>{error&&<p role="alert" className="notice">Unable to complete the requested action.</p>}<div className="management-list">{rows.map(p=><article key={p.id}><div><p className="eyebrow">{p.location} · {p.status}</p><h3>{p.title}</h3><p>{formatPrice(p.price,p.purpose)} · {p.area} sq ft</p></div><div className="toolbar"><Link className="button outline" href={"/admin/properties/"+p.id}>Edit & media</Link><form action={changeStatus}><input type="hidden" name="id" value={p.id||""}/><input type="hidden" name="status" value={p.status==="published"?"draft":"published"}/><button className="button">{p.status==="published"?"Unpublish":"Publish"}</button></form><form action={changeStatus}><input type="hidden" name="id" value={p.id||""}/><input type="hidden" name="status" value="archived"/><button className="button outline">Archive</button></form></div></article>)}</div>{!rows.length&&<p className="notice">No properties yet.</p>}</Dashboard>
}
