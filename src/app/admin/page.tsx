import Link from "next/link";
import {requireRole} from "@/lib/auth";
import {db} from "@/lib/db.mjs";
import {Dashboard} from "@/components/dashboard";
export const dynamic="force-dynamic";
export default async function Admin(){const user=await requireRole("owner");const q=await db().query("SELECT count(*)::int AS total,count(*) FILTER(WHERE status='published')::int AS published,count(*) FILTER(WHERE status='draft')::int AS draft FROM properties WHERE organization_id=$1",[user.organization_id]);const n=q.rows[0];return <Dashboard user={user} title="Owner overview"><div className="benefits"><div><h2>{n.total}</h2><p>Total properties</p></div><div><h2>{n.published}</h2><p>Published properties</p></div><div><h2>{n.draft}</h2><p>Draft properties</p></div></div><div className="toolbar"><Link href="/admin/properties" className="button">Manage properties</Link><Link href="/admin/properties/new" className="button outline">Add property</Link></div><p className="notice">Database-backed property counts. CRM and visits are scheduled for later phases.</p></Dashboard>}
