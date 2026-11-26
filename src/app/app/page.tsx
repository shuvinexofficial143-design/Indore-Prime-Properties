import Link from "next/link";
import {requireRole} from "@/lib/auth";
import {Dashboard} from "@/components/dashboard";
export const dynamic="force-dynamic";
export default async function Customer(){const user=await requireRole("customer");return <Dashboard user={user} title="Customer workspace"><p className="notice">Your profile is protected. Collections are browser-local. Linked demo visits and internal notifications are available.</p><div className="toolbar"><Link className="button" href="/properties">Explore demo properties</Link><Link className="button outline" href="/saved">Saved properties</Link><Link className="button outline" href="/compare">Compare</Link><Link className="button outline" href="/recent">Recently viewed</Link><Link className="button outline" href="/calculator">EMI calculator</Link><Link className="button outline" href="/visits">My visits</Link><Link className="button outline" href="/notifications">Notifications</Link></div></Dashboard>}
