import {requireRole} from "@/lib/auth";
import {Dashboard} from "@/components/dashboard";
export const dynamic="force-dynamic";
export default async function Agent(){const user=await requireRole("agent");return <Dashboard user={user} title="Agent workspace"><p className="notice">Your account is authorized. Lead assignments, visits and follow-ups are not implemented yet.</p></Dashboard>}
