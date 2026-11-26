import Link from "next/link";
import {requireRole} from "@/lib/auth";
import {Dashboard} from "@/components/dashboard";
export const dynamic="force-dynamic";
export default async function Customer(){const user=await requireRole("customer");return <Dashboard user={user} title="Customer workspace"><p className="notice">Your profile is protected. Saved properties and site visits will be added later.</p><Link className="button" href="/properties">Explore demo properties</Link></Dashboard>}
