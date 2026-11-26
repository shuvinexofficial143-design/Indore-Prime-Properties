import {DashboardNav} from "./dashboard-nav";
import Link from "next/link";
import type {ReactNode} from "react";
import type {SessionUser} from "@/lib/auth";
export function Dashboard({user,title,children}:{user:SessionUser;title:string;children:ReactNode}){
 return <main className="section dashboard-shell"><DashboardNav role={user.role}/><div className="dashboard-main"><div className="dashboard-top"><div><p className="eyebrow">{user.organization_name} · {user.role}</p><h1>{title}</h1><p>{user.email}</p></div><form method="post" action="/api/auth/logout"><button className="button outline">Sign out</button></form></div><div className="dashboard-content">{children}</div><Link className="text-link" href="/">Public website →</Link></div></main>;
}
